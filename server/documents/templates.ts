import type { BusinessDetails, Client, Deal, DocumentType, Profile, ServiceTemplate } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";

type Bundle = {
  deal: Deal & { client: Client; serviceTemplate: ServiceTemplate | null };
  profile: Profile | null;
  businessDetails: BusinessDetails | null;
  type: DocumentType;
  docNumber: string;
  generatedAt: Date;
};

function baseLayout(title: string, content: string) {
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #1f2937; margin: 0; padding: 32px; background: #ffffff; }
    .page { max-width: 840px; margin: 0 auto; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    h2 { font-size: 16px; margin-top: 24px; margin-bottom: 12px; }
    p, li { font-size: 14px; line-height: 1.6; }
    .meta { margin-bottom: 24px; color: #6b7280; }
    .box { border: 1px solid #d1d5db; border-radius: 16px; padding: 18px; margin-bottom: 18px; }
    .row { display: flex; justify-content: space-between; gap: 24px; }
    .row > div { flex: 1; }
    .total { font-size: 20px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; font-size: 14px; vertical-align: top; }
    .signatures { margin-top: 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
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
  const executorName = profile?.fullName ?? businessDetails?.signerName ?? "________________";
  const executorInn = profile?.inn ?? "____________";
  const clientName = deal.client.companyName || deal.client.name;
  const dealTitle = deal.title;
  const amount = formatCurrency(deal.amount.toString());
  const date = formatDate(generatedAt);
  const city = profile?.city ?? "____________";
  const description = deal.description ?? "Описание услуги не заполнено";
  const clientInn = deal.client.inn ? `<br />ИНН: ${deal.client.inn}` : "";

  if (type === "invoice") {
    return baseLayout(
      `Счет ${docNumber}`,
      `<h1>Счет на оплату № ${docNumber}</h1>
      <p class="meta">от ${date}</p>
      <div class="box">
        <div class="row">
          <div><strong>Исполнитель</strong><p>${executorName}<br />ИНН: ${executorInn}</p></div>
          <div><strong>Заказчик</strong><p>${clientName}${clientInn}</p></div>
        </div>
      </div>
      <table>
        <thead>
          <tr><th>Услуга</th><th>Описание</th><th>Сумма</th></tr>
        </thead>
        <tbody>
          <tr><td>${dealTitle}</td><td>${description}</td><td>${amount}</td></tr>
        </tbody>
      </table>
      <p class="total">Итого к оплате: ${amount}</p>
      <p>Оплата по данному счету подтверждает согласие заказчика с объемом и стоимостью работ. Реквизиты и способ оплаты стороны согласуют отдельно.</p>`,
    );
  }

  if (type === "act") {
    return baseLayout(
      `Акт ${docNumber}`,
      `<h1>Акт оказанных услуг № ${docNumber}</h1>
      <p class="meta">от ${date}</p>
      <p>${executorName}, ИНН ${executorInn}, именуемый далее Исполнитель, и ${clientName}, именуемый далее Заказчик, подписали настоящий акт о нижеследующем.</p>
      <table>
        <thead>
          <tr><th>Услуга</th><th>Дата</th><th>Стоимость</th></tr>
        </thead>
        <tbody>
          <tr><td>${dealTitle}</td><td>${date}</td><td>${amount}</td></tr>
        </tbody>
      </table>
      <p>Услуги оказаны в полном объеме, стороны претензий по качеству и срокам исполнения не имеют.</p>
      <div class="signatures">
        <div><strong>Исполнитель</strong><p>${executorName}</p></div>
        <div><strong>Заказчик</strong><p>${clientName}</p></div>
      </div>`,
    );
  }

  return baseLayout(
    `Договор ${docNumber}`,
    `<h1>Договор оказания услуг № ${docNumber}</h1>
    <p class="meta">г. ${city} от ${date}</p>
    <p>${executorName}, ИНН ${executorInn}, именуемый далее Исполнитель, с одной стороны, и ${clientName}, именуемый далее Заказчик, с другой стороны, заключили настоящий договор.</p>
    <h2>1. Предмет договора</h2>
    <p>Исполнитель обязуется оказать услугу «${dealTitle}», а Заказчик обязуется принять результат работ и оплатить их в согласованном размере.</p>
    <h2>2. Стоимость и порядок оплаты</h2>
    <p>Стоимость услуг составляет ${amount}. ${deal.prepaymentAmount ? `Предоплата: ${formatCurrency(deal.prepaymentAmount.toString())}.` : "Предоплата по договору не предусмотрена."}</p>
    <h2>3. Сроки</h2>
    <p>${deal.startDate ? `Дата начала работ: ${formatDate(deal.startDate)}.` : "Дата начала работ определяется дополнительно."} ${deal.dueDate ? `Срок выполнения: до ${formatDate(deal.dueDate)}.` : "Срок выполнения стороны согласуют отдельно."}</p>
    <h2>4. Порядок сдачи и приемки</h2>
    <p>Результат услуг передается Заказчику в согласованной форме. Подтверждением оказания услуг является подписанный акт или иное согласованное сторонами подтверждение.</p>
    <div class="signatures">
      <div><strong>Исполнитель</strong><p>${executorName}</p></div>
      <div><strong>Заказчик</strong><p>${clientName}</p></div>
    </div>`,
  );
}