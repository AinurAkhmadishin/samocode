import path from "path";
import type { TDocumentDefinitions, Content, TableCell } from "pdfmake/interfaces";
import type { BusinessDetails, Client, Deal, DocumentType, Profile, ServiceTemplate } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";

const PdfPrinter = require("pdfmake/js/Printer").default as new (fontDescriptors: Record<string, unknown>) => {
  createPdfKitDocument: (docDefinition: unknown, options?: unknown) => Promise<NodeJS.ReadWriteStream>;
};

const printer = new PdfPrinter({
  Roboto: {
    normal: path.join(process.cwd(), "node_modules", "pdfmake", "fonts", "Roboto", "Roboto-Regular.ttf"),
    bold: path.join(process.cwd(), "node_modules", "pdfmake", "fonts", "Roboto", "Roboto-Medium.ttf"),
    italics: path.join(process.cwd(), "node_modules", "pdfmake", "fonts", "Roboto", "Roboto-Italic.ttf"),
    bolditalics: path.join(process.cwd(), "node_modules", "pdfmake", "fonts", "Roboto", "Roboto-MediumItalic.ttf"),
  },
});

type Bundle = {
  deal: Deal & { client: Client; serviceTemplate: ServiceTemplate | null };
  profile: Profile | null;
  businessDetails: BusinessDetails | null;
  type: DocumentType;
  docNumber: string;
  generatedAt: Date;
};

function makeCell(text: string, bold = false): TableCell {
  return {
    text,
    bold,
    margin: [0, 6, 0, 6],
  };
}

function buildDefinition({ deal, profile, businessDetails, type, docNumber, generatedAt }: Bundle): TDocumentDefinitions {
  const executorName = profile?.fullName ?? businessDetails?.signerName ?? "________________";
  const executorInn = profile?.inn ?? "____________";
  const clientName = deal.client.companyName || deal.client.name;
  const dealTitle = deal.title;
  const amount = formatCurrency(deal.amount.toString());
  const date = formatDate(generatedAt);
  const city = profile?.city ?? "____________";
  const description = deal.description ?? "Описание услуги не заполнено";
  const prepayment = deal.prepaymentAmount ? formatCurrency(deal.prepaymentAmount.toString()) : null;

  const styles = {
    header: { fontSize: 22, bold: true },
    subheader: { fontSize: 11, color: "#6b7280" },
    section: { fontSize: 14, bold: true },
    boxTitle: { fontSize: 11, bold: true, color: "#111827" },
    total: { fontSize: 16, bold: true },
  } as const;

  let content: Content[] = [];

  if (type === "invoice") {
    content = [
      { text: `Счет на оплату № ${docNumber}`, style: "header" },
      { text: `от ${date}`, style: "subheader", margin: [0, 4, 0, 18] },
      {
        table: {
          widths: ["*", "*"],
          body: [[
            { stack: [{ text: "Исполнитель", style: "boxTitle" }, { text: `${executorName}\nИНН: ${executorInn}` }], margin: [0, 4, 0, 4] },
            { stack: [{ text: "Заказчик", style: "boxTitle" }, { text: `${clientName}${deal.client.inn ? `\nИНН: ${deal.client.inn}` : ""}` }], margin: [0, 4, 0, 4] },
          ]],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 18],
      },
      {
        table: {
          headerRows: 1,
          widths: ["28%", "*", "20%"],
          body: [
            [makeCell("Услуга", true), makeCell("Описание", true), makeCell("Сумма", true)],
            [makeCell(dealTitle), makeCell(description), makeCell(amount)],
          ],
        },
        layout: "lightHorizontalLines",
      },
      { text: `Итого к оплате: ${amount}`, style: "total", margin: [0, 16, 0, 8] },
      {
        text: "Оплата по данному счету подтверждает согласие заказчика с объемом и стоимостью работ. Реквизиты и способ оплаты стороны согласуют отдельно.",
      },
    ];
  } else if (type === "act") {
    content = [
      { text: `Акт оказанных услуг № ${docNumber}`, style: "header" },
      { text: `от ${date}`, style: "subheader", margin: [0, 4, 0, 18] },
      {
        text: `${executorName}, ИНН ${executorInn}, именуемый далее Исполнитель, и ${clientName}, именуемый далее Заказчик, подписали настоящий акт о нижеследующем.`,
        margin: [0, 0, 0, 12],
      },
      {
        table: {
          headerRows: 1,
          widths: ["40%", "25%", "25%"],
          body: [
            [makeCell("Услуга", true), makeCell("Дата", true), makeCell("Стоимость", true)],
            [makeCell(dealTitle), makeCell(date), makeCell(amount)],
          ],
        },
        layout: "lightHorizontalLines",
        margin: [0, 0, 0, 12],
      },
      {
        text: "Услуги оказаны в полном объеме, стороны претензий по качеству и срокам исполнения не имеют.",
        margin: [0, 0, 0, 28],
      },
      {
        columns: [
          { width: "*", stack: [{ text: "Исполнитель", style: "boxTitle" }, { text: executorName, margin: [0, 10, 0, 0] }] },
          { width: 32, text: "" },
          { width: "*", stack: [{ text: "Заказчик", style: "boxTitle" }, { text: clientName, margin: [0, 10, 0, 0] }] },
        ],
      },
    ];
  } else {
    content = [
      { text: `Договор оказания услуг № ${docNumber}`, style: "header" },
      { text: `г. ${city} от ${date}`, style: "subheader", margin: [0, 4, 0, 18] },
      {
        text: `${executorName}, ИНН ${executorInn}, именуемый далее Исполнитель, с одной стороны, и ${clientName}, именуемый далее Заказчик, с другой стороны, заключили настоящий договор.`,
        margin: [0, 0, 0, 16],
      },
      { text: "1. Предмет договора", style: "section", margin: [0, 0, 0, 8] },
      {
        text: `Исполнитель обязуется оказать услугу «${dealTitle}», а Заказчик обязуется принять результат работ и оплатить их в согласованном размере.`,
        margin: [0, 0, 0, 12],
      },
      { text: "2. Стоимость и порядок оплаты", style: "section", margin: [0, 0, 0, 8] },
      {
        text: `Стоимость услуг составляет ${amount}. ${prepayment ? `Предоплата: ${prepayment}.` : "Предоплата по договору не предусмотрена."}`,
        margin: [0, 0, 0, 12],
      },
      { text: "3. Сроки", style: "section", margin: [0, 0, 0, 8] },
      {
        text: `${deal.startDate ? `Дата начала работ: ${formatDate(deal.startDate)}.` : "Дата начала работ определяется дополнительно."} ${deal.dueDate ? `Срок выполнения: до ${formatDate(deal.dueDate)}.` : "Срок выполнения стороны согласуют отдельно."}`,
        margin: [0, 0, 0, 12],
      },
      { text: "4. Порядок сдачи и приемки", style: "section", margin: [0, 0, 0, 8] },
      {
        text: "Результат услуг передается Заказчику в согласованной форме. Подтверждением оказания услуг является подписанный акт или иное согласованное сторонами подтверждение.",
        margin: [0, 0, 0, 28],
      },
      {
        columns: [
          { width: "*", stack: [{ text: "Исполнитель", style: "boxTitle" }, { text: executorName, margin: [0, 10, 0, 0] }] },
          { width: 32, text: "" },
          { width: "*", stack: [{ text: "Заказчик", style: "boxTitle" }, { text: clientName, margin: [0, 10, 0, 0] }] },
        ],
      },
    ];
  }

  return {
    pageSize: "A4",
    pageMargins: [40, 48, 40, 48],
    defaultStyle: {
      font: "Roboto",
      fontSize: 11,
      lineHeight: 1.35,
      color: "#1f2937",
    },
    styles,
    content,
  };
}

export async function generateDocumentPdf(bundle: Bundle) {
  const docDefinition = buildDefinition(bundle);
  const doc = await printer.createPdfKitDocument(docDefinition);

  return await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}
