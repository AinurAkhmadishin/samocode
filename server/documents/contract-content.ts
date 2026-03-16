import type { BusinessDetails, Client, Deal, Profile, ServiceTemplate } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/utils";

export type ContractBundle = {
  deal: Deal & { client: Client; serviceTemplate: ServiceTemplate | null };
  profile: Profile | null;
  businessDetails: BusinessDetails | null;
  docNumber: string;
  generatedAt: Date;
};

export type ContractSection = {
  title: string;
  paragraphs: string[];
};

export type ContractRenderData = {
  title: string;
  cityLine: string;
  dateLine: string;
  preamble: string;
  sections: ContractSection[];
  executorRequisites: string[];
  clientRequisites: string[];
  executorSignature: string;
  clientSignature: string;
};

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function cleanInlineText(value?: string | null) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  return normalized.replace(/\s+/g, " ");
}

function cleanParagraphText(value?: string | null) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return null;
  }

  return normalized
    .split(/\n+/)
    .map((part) => part.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .join("\n");
}

function ensureSentence(text: string) {
  return /[.!?…]$/.test(text) ? text : `${text}.`;
}

function formatDateWithPrefix(date: Date | null | undefined, prefix: string) {
  if (!date) {
    return null;
  }

  const formatted = formatDate(date);
  return formatted !== "Не указана" ? `${prefix} ${formatted}` : null;
}

function getServiceName(deal: Deal & { client: Client; serviceTemplate: ServiceTemplate | null }) {
  return cleanInlineText(deal.serviceTemplate?.title)
    ?? cleanInlineText(deal.title)
    ?? "оказание услуг";
}

function getExecutorStatusLabel(profile: Profile | null, businessDetails: BusinessDetails | null) {
  const raw = (businessDetails?.legalStatus ?? profile?.role ?? "").toLowerCase();

  if (["ip", "ie", "entrepreneur", "individual_entrepreneur", "sole_proprietor"].includes(raw)) {
    return "индивидуальный предприниматель";
  }

  if (["company", "ooo", "llc", "legal_entity"].includes(raw)) {
    return "юридическое лицо";
  }

  if (["self_employed", "self-employed", "freelancer", "самозанятый"].includes(raw)) {
    return "самозанятый";
  }

  return "исполнитель";
}

function getExecutorDisplayName(profile: Profile | null, businessDetails: BusinessDetails | null) {
  return normalizeText(businessDetails?.displayName)
    ?? normalizeText(profile?.fullName)
    ?? normalizeText(businessDetails?.signerName)
    ?? "Исполнитель";
}

function getExecutorSignerName(profile: Profile | null, businessDetails: BusinessDetails | null) {
  return normalizeText(profile?.fullName)
    ?? normalizeText(businessDetails?.signerName)
    ?? normalizeText(businessDetails?.displayName)
    ?? "Исполнитель";
}

function getExecutorInn(profile: Profile | null) {
  return normalizeText(profile?.inn);
}

function getClientDisplayName(client: Client) {
  return client.type === "company"
    ? normalizeText(client.companyName) ?? normalizeText(client.name) ?? "Заказчик"
    : normalizeText(client.name) ?? "Заказчик";
}

function getClientFormalName(client: Client) {
  const displayName = getClientDisplayName(client);
  const inn = normalizeText(client.inn);
  const signer = normalizeText(client.contactName);

  if (client.type === "company") {
    return [
      displayName,
      inn ? `ИНН ${inn}` : null,
      signer ? `в лице ${signer}` : null,
    ].filter(Boolean).join(", ");
  }

  return [displayName, inn ? `ИНН ${inn}` : null].filter(Boolean).join(", ");
}

function getClientSignatureName(client: Client) {
  return client.type === "company"
    ? normalizeText(client.contactName) ?? getClientDisplayName(client)
    : getClientDisplayName(client);
}

function splitDescription(description: string) {
  const normalized = cleanParagraphText(description);

  if (!normalized) {
    return [];
  }

  return normalized
    .split("\n")
    .map((part) => part.trim())
    .filter(Boolean);
}

function buildServiceParagraphs(deal: Deal & { client: Client; serviceTemplate: ServiceTemplate | null }) {
  const serviceName = getServiceName(deal);
  const templateDescription = cleanParagraphText(deal.serviceTemplate?.description);
  const dealDescription = cleanParagraphText(deal.description);
  const description = dealDescription ?? templateDescription;
  const descriptionParts = description ? splitDescription(description) : [];
  const unit = cleanInlineText(deal.serviceTemplate?.unit);
  const paragraphs: string[] = [];
  const introParts = [`Исполнитель обязуется оказать Заказчику услуги по ${serviceName}`];

  if (descriptionParts.length === 1 && descriptionParts[0].length <= 220) {
    introParts.push(`включая ${descriptionParts[0].replace(/[.!?…]+$/, "")}`);
  }

  paragraphs.push(`${introParts.join(", ")}, а Заказчик обязуется принять и оплатить услуги на условиях настоящего договора.`);

  if (descriptionParts.length > 1 || (descriptionParts.length === 1 && descriptionParts[0].length > 220)) {
    paragraphs.push(`Состав и объем услуг включают: ${ensureSentence(descriptionParts[0])}`);

    for (const part of descriptionParts.slice(1)) {
      paragraphs.push(ensureSentence(part));
    }
  } else if (!descriptionParts.length) {
    paragraphs.push("Состав услуг определяется наименованием сделки, согласованными условиями сотрудничества и рабочими материалами, переданными Заказчиком для исполнения.");
  }

  if (unit) {
    paragraphs.push(`Единица результата или объема услуг: ${unit}.`);
  }

  paragraphs.push("Результат услуг передается Заказчику в согласованной сторонами форме, в том числе в электронном виде, если иной формат отдельно не согласован.");

  return paragraphs;
}

function buildPaymentParagraphs(deal: Deal) {
  const amountNumber = Number(deal.amount);
  const prepaymentNumber = deal.prepaymentAmount ? Number(deal.prepaymentAmount) : 0;
  const safeAmount = Number.isFinite(amountNumber) ? Math.max(amountNumber, 0) : 0;
  const safePrepayment = Number.isFinite(prepaymentNumber) ? Math.max(prepaymentNumber, 0) : 0;
  const cappedPrepayment = Math.min(safePrepayment, safeAmount);
  const remainderNumber = Math.max(safeAmount - cappedPrepayment, 0);
  const amount = formatCurrency(safeAmount);
  const prepayment = cappedPrepayment > 0 ? formatCurrency(cappedPrepayment) : null;
  const remainder = remainderNumber > 0 ? formatCurrency(remainderNumber) : null;
  const dueDateText = deal.dueDate ? formatDate(deal.dueDate) : null;
  const completionReference = dueDateText
    ? `после оказания услуг, передачи результата или подписания акта, но в любом случае не позднее ${dueDateText}`
    : "после оказания услуг, передачи результата или подписания акта";
  const paragraphs = [`Общая стоимость услуг по договору составляет ${amount}.`];

  if (cappedPrepayment >= safeAmount && safeAmount > 0) {
    paragraphs.push(`Услуги оплачиваются авансом в полном объеме в размере ${amount} до начала их оказания, если стороны письменно не согласовали иной срок оплаты.`);
  } else if (cappedPrepayment > 0 && prepayment && remainder) {
    paragraphs.push(`Заказчик уплачивает предоплату в размере ${prepayment} до начала оказания услуг или в иной согласованный сторонами срок.`);
    paragraphs.push(`Оставшаяся часть стоимости услуг в размере ${remainder} оплачивается ${completionReference}.`);
  } else {
    paragraphs.push(`Заказчик оплачивает услуги в полном объеме в размере ${amount} ${completionReference}, если стороны не согласовали иной порядок оплаты.`);
  }

  paragraphs.push("Датой оплаты считается дата поступления денежных средств Исполнителю.");

  return paragraphs;
}

function appendRequisite(lines: string[], label: string, value?: string | null) {
  const normalized = cleanInlineText(value);

  if (normalized) {
    lines.push(`${label}: ${normalized}`);
  }
}

function buildExecutorRequisites(profile: Profile | null, businessDetails: BusinessDetails | null) {
  const executorDisplayName = getExecutorDisplayName(profile, businessDetails);
  const executorSignerName = getExecutorSignerName(profile, businessDetails);
  const executorStatus = getExecutorStatusLabel(profile, businessDetails);
  const lines = [executorDisplayName];

  if (executorSignerName !== executorDisplayName) {
    lines.push(`ФИО: ${executorSignerName}`);
  }

  lines.push(`Статус: ${executorStatus}`);
  appendRequisite(lines, "ИНН", getExecutorInn(profile));
  appendRequisite(lines, "Телефон", businessDetails?.paymentPhone ?? profile?.phone);
  appendRequisite(lines, "Email", businessDetails?.emailForDocs);
  appendRequisite(lines, "Банк", businessDetails?.paymentBank);
  appendRequisite(lines, "Карта / счет", businessDetails?.paymentCardMask);

  return lines;
}

function buildClientRequisites(client: Client) {
  const displayName = getClientDisplayName(client);
  const lines = [displayName];

  if (client.type === "company") {
    appendRequisite(lines, "Контактное лицо", client.contactName);
    appendRequisite(lines, "ИНН", client.inn);
    appendRequisite(lines, "Email", client.email);
    appendRequisite(lines, "Телефон", client.phone);
    return lines;
  }

  appendRequisite(lines, "ИНН", client.inn);
  appendRequisite(lines, "Email", client.email);
  appendRequisite(lines, "Телефон", client.phone);

  return lines;
}

export function buildContractRenderData({ deal, profile, businessDetails, docNumber, generatedAt }: ContractBundle): ContractRenderData {
  const executorDisplayName = getExecutorDisplayName(profile, businessDetails);
  const executorSignerName = getExecutorSignerName(profile, businessDetails);
  const executorInn = getExecutorInn(profile);
  const executorStatus = getExecutorStatusLabel(profile, businessDetails);
  const clientDisplayName = getClientDisplayName(deal.client);
  const clientFormalName = getClientFormalName(deal.client);
  const city = normalizeText(profile?.city);
  const startDateLine = formatDateWithPrefix(deal.startDate, "Дата начала оказания услуг:");
  const dueDateLine = formatDateWithPrefix(deal.dueDate, "Срок оказания услуг: до");

  const executorFormalName = [
    executorDisplayName,
    executorInn ? `ИНН ${executorInn}` : null,
    `статус: ${executorStatus}`,
  ].filter(Boolean).join(", ");

  const sections: ContractSection[] = [
    {
      title: "1. Предмет договора",
      paragraphs: buildServiceParagraphs(deal),
    },
    {
      title: "2. Стоимость и порядок оплаты",
      paragraphs: buildPaymentParagraphs(deal),
    },
    {
      title: "3. Сроки",
      paragraphs: [
        startDateLine
          ? `${startDateLine}.`
          : "Дата начала оказания услуг определяется по факту предоставления Заказчиком необходимых материалов и подтверждения старта работы.",
        dueDateLine
          ? `${dueDateLine}.`
          : "Конечный срок оказания услуг стороны согласуют в переписке или иных рабочих материалах по сделке.",
        "Если Заказчик задерживает материалы, согласования или ответы, срок оказания услуг сдвигается на соответствующий период задержки.",
      ],
    },
    {
      title: "4. Порядок взаимодействия",
      paragraphs: [
        "Заказчик предоставляет Исполнителю материалы, доступы и информацию, необходимые для оказания услуг.",
        "Исполнитель вправе запрашивать у Заказчика уточнения и дополнительные данные, необходимые для выполнения работы.",
        "Задержка материалов, обратной связи или согласований со стороны Заказчика может влиять на сроки оказания услуг.",
      ],
    },
    {
      title: "5. Порядок сдачи и приемки",
      paragraphs: [
        "Результат услуг передается Заказчику в согласованной сторонами форме.",
        "Заказчик в течение 3 рабочих дней с момента получения результата услуг подписывает акт либо направляет Исполнителю мотивированные замечания.",
        "Если в указанный срок замечания не направлены, услуги считаются оказанными надлежащим образом и принятыми Заказчиком в полном объеме.",
      ],
    },
    {
      title: "6. Права и обязанности сторон",
      paragraphs: [
        "Исполнитель обязан оказать услуги в согласованный срок и передать результат в согласованной форме.",
        "Заказчик обязан предоставить необходимую информацию, материалы и своевременно оплатить услуги.",
        "Исполнитель вправе приостановить выполнение услуг при задержке оплаты, материалов или обязательных согласований со стороны Заказчика.",
      ],
    },
    {
      title: "7. Ответственность сторон",
      paragraphs: [
        "Стороны несут ответственность в соответствии с законодательством Российской Федерации.",
        "Исполнитель не несет ответственности за нарушение сроков, вызванное действиями или бездействием Заказчика, включая задержку оплаты, материалов и согласований.",
      ],
    },
    {
      title: "8. Расторжение договора",
      paragraphs: [
        "Договор может быть расторгнут по соглашению сторон либо в одностороннем порядке с предварительным уведомлением другой стороны.",
        "При расторжении договора Заказчик оплачивает фактически оказанные на дату расторжения услуги.",
      ],
    },
    {
      title: "9. Заключительные положения",
      paragraphs: [
        "Договор вступает в силу с момента его подписания сторонами и действует до полного исполнения обязательств.",
        "Стороны вправе использовать электронный документооборот, а также обмен скан-копиями и документами по электронной почте или в мессенджерах, если такой порядок используется в работе.",
        "Во всем остальном, что не урегулировано настоящим договором, стороны руководствуются законодательством Российской Федерации.",
      ],
    },
  ];

  return {
    title: `Договор оказания услуг № ${docNumber}`,
    cityLine: city ? `г. ${city}` : "",
    dateLine: formatDate(generatedAt),
    preamble: `${executorFormalName}, далее — "Исполнитель", с одной стороны, и ${clientFormalName}, далее — "Заказчик", с другой стороны, заключили настоящий договор о нижеследующем.`,
    sections,
    executorRequisites: buildExecutorRequisites(profile, businessDetails),
    clientRequisites: buildClientRequisites(deal.client),
    executorSignature: executorSignerName,
    clientSignature: getClientSignatureName(deal.client),
  };
}
