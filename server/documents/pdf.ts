import fs from "fs/promises";
import path from "path";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import type { BusinessDetails, Client, Deal, DocumentType, Profile, ServiceTemplate } from "@prisma/client";
import { buildContractRenderData } from "@/server/documents/contract-content";
import { formatCurrency, formatDate } from "@/lib/utils";

type Bundle = {
  deal: Deal & { client: Client; serviceTemplate: ServiceTemplate | null };
  profile: Profile | null;
  businessDetails: BusinessDetails | null;
  type: DocumentType;
  docNumber: string;
  generatedAt: Date;
};

type PdfContext = {
  doc: PDFDocument;
  page: PDFPage;
  regularFont: PDFFont;
  boldFont: PDFFont;
  width: number;
  height: number;
  marginX: number;
  topY: number;
  bottomY: number;
  cursorY: number;
};

type TextOptions = {
  size?: number;
  bold?: boolean;
  color?: ReturnType<typeof rgb>;
  align?: "left" | "center" | "right";
  gapAfter?: number;
};

type TableCell = {
  text: string;
  bold?: boolean;
  align?: "left" | "right" | "center";
};

type TableRow = TableCell[];

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 40;
const MARGIN_TOP = 48;
const MARGIN_BOTTOM = 48;
const COLORS = {
  text: rgb(31 / 255, 41 / 255, 55 / 255),
  muted: rgb(107 / 255, 114 / 255, 128 / 255),
  border: rgb(209 / 255, 213 / 255, 219 / 255),
};

function fontPath(filename: string) {
  return path.join(process.cwd(), "server", "documents", "fonts", "Roboto", filename);
}

async function loadFonts(doc: PDFDocument) {
  const [regularBytes, mediumBytes] = await Promise.all([
    fs.readFile(fontPath("Roboto-Regular.ttf")),
    fs.readFile(fontPath("Roboto-Medium.ttf")),
  ]);

  doc.registerFontkit(fontkit);

  const [regularFont, boldFont] = await Promise.all([
    doc.embedFont(regularBytes),
    doc.embedFont(mediumBytes),
  ]);

  return { regularFont, boldFont };
}

function createContext(doc: PDFDocument, regularFont: PDFFont, boldFont: PDFFont): PdfContext {
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  return {
    doc,
    page,
    regularFont,
    boldFont,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    marginX: MARGIN_X,
    topY: PAGE_HEIGHT - MARGIN_TOP,
    bottomY: MARGIN_BOTTOM,
    cursorY: PAGE_HEIGHT - MARGIN_TOP,
  };
}

function availableWidth(ctx: PdfContext) {
  return ctx.width - ctx.marginX * 2;
}

function currentFont(ctx: PdfContext, bold = false) {
  return bold ? ctx.boldFont : ctx.regularFont;
}

function lineHeight(size: number) {
  return size * 1.35;
}

function ensureSpace(ctx: PdfContext, requiredHeight: number) {
  if (ctx.cursorY - requiredHeight >= ctx.bottomY) {
    return;
  }

  ctx.page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  ctx.cursorY = ctx.topY;
}

function sanitizeText(text: string) {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const paragraphs = sanitizeText(text).split("\n");
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push("");
      continue;
    }

    const words = paragraph.split(/\s+/);
    let currentLine = "";

    for (const word of words) {
      const nextLine = currentLine ? `${currentLine} ${word}` : word;
      const nextWidth = font.widthOfTextAtSize(nextLine, size);

      if (!currentLine || nextWidth <= maxWidth) {
        currentLine = nextLine;
        continue;
      }

      lines.push(currentLine);
      currentLine = word;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

function drawTextBlock(ctx: PdfContext, text: string, options: TextOptions = {}) {
  const size = options.size ?? 11;
  const font = currentFont(ctx, options.bold);
  const color = options.color ?? COLORS.text;
  const maxWidth = availableWidth(ctx);
  const lines = wrapText(text, font, size, maxWidth);
  const blockHeight = Math.max(lines.length, 1) * lineHeight(size);

  ensureSpace(ctx, blockHeight);

  for (const line of lines.length ? lines : [""]) {
    const textWidth = font.widthOfTextAtSize(line, size);
    let x = ctx.marginX;

    if (options.align === "center") {
      x += (maxWidth - textWidth) / 2;
    } else if (options.align === "right") {
      x += maxWidth - textWidth;
    }

    ctx.page.drawText(line, {
      x,
      y: ctx.cursorY - size,
      size,
      font,
      color,
    });

    ctx.cursorY -= lineHeight(size);
  }

  ctx.cursorY -= options.gapAfter ?? 0;
}

function drawColumns(ctx: PdfContext, columns: Array<{ title: string; body: string }>, gapAfter = 18) {
  const columnGap = 24;
  const totalWidth = availableWidth(ctx);
  const columnWidth = (totalWidth - columnGap * (columns.length - 1)) / columns.length;
  const titleSize = 11;
  const bodySize = 11;
  const columnLayouts = columns.map((column) => {
    const titleLines = wrapText(column.title, ctx.boldFont, titleSize, columnWidth);
    const bodyLines = wrapText(column.body, ctx.regularFont, bodySize, columnWidth);
    const height = titleLines.length * lineHeight(titleSize) + 6 + bodyLines.length * lineHeight(bodySize);

    return { ...column, titleLines, bodyLines, height };
  });
  const blockHeight = Math.max(...columnLayouts.map((column) => column.height));

  ensureSpace(ctx, blockHeight);

  let x = ctx.marginX;
  const startY = ctx.cursorY;

  for (const column of columnLayouts) {
    let y = startY;

    for (const line of column.titleLines) {
      ctx.page.drawText(line, {
        x,
        y: y - titleSize,
        size: titleSize,
        font: ctx.boldFont,
        color: COLORS.text,
      });
      y -= lineHeight(titleSize);
    }

    y -= 6;

    for (const line of column.bodyLines) {
      ctx.page.drawText(line, {
        x,
        y: y - bodySize,
        size: bodySize,
        font: ctx.regularFont,
        color: COLORS.text,
      });
      y -= lineHeight(bodySize);
    }

    x += columnWidth + columnGap;
  }

  ctx.cursorY -= blockHeight + gapAfter;
}

function rowHeight(ctx: PdfContext, row: TableRow, widths: number[], size: number) {
  const heights = row.map((cell, index) => {
    const font = currentFont(ctx, cell.bold);
    const innerWidth = widths[index] - 12;
    const lines = wrapText(cell.text, font, size, innerWidth);

    return Math.max(lines.length, 1) * lineHeight(size) + 12;
  });

  return Math.max(...heights);
}

function drawTable(ctx: PdfContext, widths: number[], rows: TableRow[], gapAfter = 18) {
  const size = 11;
  const tableWidth = availableWidth(ctx);
  const columnWidths = widths.map((width) => width * tableWidth);
  const xPositions = [ctx.marginX];

  for (const width of columnWidths) {
    xPositions.push(xPositions[xPositions.length - 1] + width);
  }

  for (const row of rows) {
    const height = rowHeight(ctx, row, columnWidths, size);

    ensureSpace(ctx, height);

    const topY = ctx.cursorY;
    const bottomY = topY - height;

    for (const x of xPositions) {
      ctx.page.drawLine({
        start: { x, y: topY },
        end: { x, y: bottomY },
        color: COLORS.border,
        thickness: 1,
      });
    }

    ctx.page.drawLine({
      start: { x: ctx.marginX, y: topY },
      end: { x: ctx.marginX + tableWidth, y: topY },
      color: COLORS.border,
      thickness: 1,
    });
    ctx.page.drawLine({
      start: { x: ctx.marginX, y: bottomY },
      end: { x: ctx.marginX + tableWidth, y: bottomY },
      color: COLORS.border,
      thickness: 1,
    });

    let cellX = ctx.marginX;

    row.forEach((cell, index) => {
      const font = currentFont(ctx, cell.bold);
      const innerWidth = columnWidths[index] - 12;
      const lines = wrapText(cell.text, font, size, innerWidth);
      let textY = topY - 6 - size;

      for (const line of lines) {
        const lineWidth = font.widthOfTextAtSize(line, size);
        let textX = cellX + 6;

        if (cell.align === "center") {
          textX = cellX + (columnWidths[index] - lineWidth) / 2;
        } else if (cell.align === "right") {
          textX = cellX + columnWidths[index] - lineWidth - 6;
        }

        ctx.page.drawText(line, {
          x: textX,
          y: textY,
          size,
          font,
          color: COLORS.text,
        });
        textY -= lineHeight(size);
      }

      cellX += columnWidths[index];
    });

    ctx.cursorY = bottomY;
  }

  ctx.cursorY -= gapAfter;
}

function buildPdf(ctx: PdfContext, { deal, profile, businessDetails, type, docNumber, generatedAt }: Bundle) {
  const executorName = profile?.fullName?.trim() || businessDetails?.signerName?.trim() || "Исполнитель";
  const executorInn = profile?.inn?.trim() || "не указан";
  const clientName = deal.client.companyName || deal.client.name;
  const dealTitle = deal.title;
  const amount = formatCurrency(deal.amount.toString());
  const date = formatDate(generatedAt);
  const description = deal.description?.trim() || "Описание услуги не заполнено";

  if (type === "invoice") {
    drawTextBlock(ctx, `Счет на оплату № ${docNumber}`, { size: 22, bold: true });
    drawTextBlock(ctx, `от ${date}`, { size: 11, color: COLORS.muted, gapAfter: 12 });
    drawColumns(
      ctx,
      [
        { title: "Исполнитель", body: `${executorName}\nИНН: ${executorInn}` },
        { title: "Заказчик", body: `${clientName}${deal.client.inn ? `\nИНН: ${deal.client.inn}` : ""}` },
      ],
      18,
    );
    drawTable(
      ctx,
      [0.28, 0.52, 0.2],
      [
        [
          { text: "Услуга", bold: true },
          { text: "Описание", bold: true },
          { text: "Сумма", bold: true },
        ],
        [
          { text: dealTitle },
          { text: description },
          { text: amount, align: "right" },
        ],
      ],
    );
    drawTextBlock(ctx, `Итого к оплате: ${amount}`, { size: 16, bold: true, gapAfter: 8 });
    drawTextBlock(
      ctx,
      "Оплата по данному счету подтверждает согласие Заказчика с объемом и стоимостью услуг. Способ оплаты и реквизиты стороны используют в согласованном рабочем порядке.",
    );
    return;
  }

  if (type === "act") {
    drawTextBlock(ctx, `Акт оказанных услуг № ${docNumber}`, { size: 22, bold: true });
    drawTextBlock(ctx, `от ${date}`, { size: 11, color: COLORS.muted, gapAfter: 12 });
    drawTextBlock(
      ctx,
      `${executorName}, ИНН ${executorInn}, далее — "Исполнитель", и ${clientName}, далее — "Заказчик", подписали настоящий акт о нижеследующем.`,
      { gapAfter: 12 },
    );
    drawTable(
      ctx,
      [0.4, 0.25, 0.35],
      [
        [
          { text: "Услуга", bold: true },
          { text: "Дата", bold: true },
          { text: "Стоимость", bold: true },
        ],
        [
          { text: dealTitle },
          { text: date },
          { text: amount, align: "right" },
        ],
      ],
      12,
    );
    drawTextBlock(
      ctx,
      "Услуги оказаны в полном объеме, стороны претензий по качеству и срокам исполнения не имеют.",
      { gapAfter: 28 },
    );
    drawColumns(
      ctx,
      [
        { title: "Исполнитель", body: `${executorName}\nПодпись: ____________________` },
        { title: "Заказчик", body: `${clientName}\nПодпись: ____________________` },
      ],
      0,
    );
    return;
  }

  const contract = buildContractRenderData({ deal, profile, businessDetails, docNumber, generatedAt });

  drawTextBlock(ctx, contract.title, { size: 22, bold: true });

  if (contract.cityLine) {
    drawTextBlock(ctx, contract.cityLine, { size: 11, color: COLORS.muted, gapAfter: 2 });
  }

  drawTextBlock(ctx, contract.dateLine, { size: 11, color: COLORS.muted, gapAfter: 12 });
  drawTextBlock(ctx, contract.preamble, { gapAfter: 16 });

  for (const section of contract.sections) {
    drawTextBlock(ctx, section.title, { size: 14, bold: true, gapAfter: 8 });

    for (const text of section.paragraphs) {
      drawTextBlock(ctx, text, { gapAfter: 4 });
    }

    ctx.cursorY -= 6;
  }

  drawTextBlock(ctx, "10. Реквизиты и подписи сторон", { size: 14, bold: true, gapAfter: 10 });
  drawColumns(
    ctx,
    [
      { title: "Исполнитель", body: contract.executorRequisites.join("\n") },
      { title: "Заказчик", body: contract.clientRequisites.join("\n") },
    ],
    22,
  );
  drawColumns(
    ctx,
    [
      { title: "Исполнитель", body: `${contract.executorSignature}\nПодпись: ____________________` },
      { title: "Заказчик", body: `${contract.clientSignature}\nПодпись: ____________________` },
    ],
    0,
  );
}

export async function generateDocumentPdf(bundle: Bundle) {
  const doc = await PDFDocument.create();
  const { regularFont, boldFont } = await loadFonts(doc);
  const ctx = createContext(doc, regularFont, boldFont);

  buildPdf(ctx, bundle);

  return Buffer.from(await doc.save());
}

