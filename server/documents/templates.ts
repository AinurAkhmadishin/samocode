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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(text: string) {
  return `<p>${escapeHtml(text)}</p>`;
}

function linesToHtml(lines: string[]) {
  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function baseLayout(title: string, content: string) {
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #1f2937; margin: 0; padding: 32px; background: #ffffff; }
    .page { max-width: 840px; margin: 0 auto; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    h2 { font-size: 16px; margin: 24px 0 10px; }
    p, li { font-size: 14px; line-height: 1.6; margin: 0 0 10px; }
    .meta { margin-bottom: 4px; color: #6b7280; }
    .meta-stack { margin-bottom: 24px; }
    .box { border: 1px solid #d1d5db; border-radius: 16px; padding: 18px; margin-bottom: 18px; }
    .row { display: flex; justify-content: space-between; gap: 24px; }
    .row > div { flex: 1; }
    .total { font-size: 20px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; font-size: 14px; vertical-align: top; }
    .section { margin-bottom: 16px; }
    .signatures { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .signature-box { border-top: 1px solid #9ca3af; padding-top: 10px; min-height: 80px; }
    @media print {
      body { padding: 0; }
      .page { max-width: none; }
    }
  </style>
</head>
<body>
  <div class="page">
    ${content}
  </div>
</body>
</html>`;
}

export function renderDocumentTemplate({ deal, profile, businessDetails, type, docNumber, generatedAt }: Bundle) {
  const executorName = profile?.fullName?.trim() || businessDetails?.signerName?.trim() || "Исполнитель";
  const executorInn = profile?.inn?.trim() || "не указан";
  const clientName = deal.client.companyName || deal.client.name;
  const dealTitle = deal.title;
  const amount = formatCurrency(deal.amount.toString());
  const date = formatDate(generatedAt);
  const description = deal.description?.trim() || "Описание услуги не заполнено";
  const clientInn = deal.client.inn ? `<br />ИНН: ${escapeHtml(deal.client.inn)}` : "";

  if (type === "invoice") {
    return baseLayout(
      `Счет ${docNumber}`,
      `<h1>Счет на оплату № ${escapeHtml(docNumber)}</h1>
      <p class="meta">от ${escapeHtml(date)}</p>
      <div class="box">
        <div class="row">
          <div><strong>Исполнитель</strong><p>${escapeHtml(executorName)}<br />ИНН: ${escapeHtml(executorInn)}</p></div>
          <div><strong>Заказчик</strong><p>${escapeHtml(clientName)}${clientInn}</p></div>
        </div>
      </div>
      <table>
        <thead>
          <tr><th>Услуга</th><th>Описание</th><th>Сумма</th></tr>
        </thead>
        <tbody>
          <tr><td>${escapeHtml(dealTitle)}</td><td>${escapeHtml(description)}</td><td>${escapeHtml(amount)}</td></tr>
        </tbody>
      </table>
      <p class="total">Итого к оплате: ${escapeHtml(amount)}</p>
      <p>Оплата по данному счету подтверждает согласие Заказчика с объемом и стоимостью услуг. Способ оплаты и реквизиты стороны используют в согласованном рабочем порядке.</p>`,
    );
  }

  if (type === "act") {
    return baseLayout(
      `Акт ${docNumber}`,
      `<h1>Акт оказанных услуг № ${escapeHtml(docNumber)}</h1>
      <p class="meta">от ${escapeHtml(date)}</p>
      <p>${escapeHtml(executorName)}, ИНН ${escapeHtml(executorInn)}, далее — "Исполнитель", и ${escapeHtml(clientName)}, далее — "Заказчик", подписали настоящий акт о нижеследующем.</p>
      <table>
        <thead>
          <tr><th>Услуга</th><th>Дата</th><th>Стоимость</th></tr>
        </thead>
        <tbody>
          <tr><td>${escapeHtml(dealTitle)}</td><td>${escapeHtml(date)}</td><td>${escapeHtml(amount)}</td></tr>
        </tbody>
      </table>
      <p>Услуги оказаны в полном объеме, стороны претензий по качеству и срокам исполнения не имеют.</p>
      <div class="signatures">
        <div class="signature-box"><strong>Исполнитель</strong><p>${escapeHtml(executorName)}</p></div>
        <div class="signature-box"><strong>Заказчик</strong><p>${escapeHtml(clientName)}</p></div>
      </div>`,
    );
  }

  const contract = buildContractRenderData({ deal, profile, businessDetails, docNumber, generatedAt });

  const sectionsHtml = contract.sections.map((section) => `
    <div class="section">
      <h2>${escapeHtml(section.title)}</h2>
      ${section.paragraphs.map(paragraph).join("")}
    </div>
  `).join("");

  return baseLayout(
    contract.title,
    `<h1>${escapeHtml(contract.title)}</h1>
    <div class="meta-stack">
      ${contract.cityLine ? `<p class="meta">${escapeHtml(contract.cityLine)}</p>` : ""}
      <p class="meta">${escapeHtml(contract.dateLine)}</p>
    </div>
    ${paragraph(contract.preamble)}
    ${sectionsHtml}
    <h2>10. Реквизиты и подписи сторон</h2>
    <div class="box">
      <div class="row">
        <div>
          <strong>Исполнитель</strong>
          ${linesToHtml(contract.executorRequisites)}
        </div>
        <div>
          <strong>Заказчик</strong>
          ${linesToHtml(contract.clientRequisites)}
        </div>
      </div>
    </div>
    <div class="signatures">
      <div class="signature-box">
        <strong>Исполнитель</strong>
        <p>${escapeHtml(contract.executorSignature)}</p>
        <p>Подпись: ____________________</p>
      </div>
      <div class="signature-box">
        <strong>Заказчик</strong>
        <p>${escapeHtml(contract.clientSignature)}</p>
        <p>Подпись: ____________________</p>
      </div>
    </div>`,
  );
}


