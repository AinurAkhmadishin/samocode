import type { Client, Deal, Document, Reminder, ServiceTemplate } from "@prisma/client";

export type ClientServiceTemplate = Omit<ServiceTemplate, "price"> & {
  price: number;
};

export type ClientDeal = Omit<Deal, "amount" | "prepaymentAmount"> & {
  amount: number;
  prepaymentAmount: number | null;
};

export type ClientDealWithRelations = ClientDeal & {
  client: Client;
  serviceTemplate: ClientServiceTemplate | null;
  documents: Document[];
  reminders: Reminder[];
};

export function serializeServiceTemplate(template: ServiceTemplate): ClientServiceTemplate {
  return {
    ...template,
    price: Number(template.price),
  };
}

export function serializeDeal(deal: Deal): ClientDeal {
  return {
    ...deal,
    amount: Number(deal.amount),
    prepaymentAmount: deal.prepaymentAmount === null ? null : Number(deal.prepaymentAmount),
  };
}

export function serializeDealWithRelations(
  deal: Deal & { client: Client; serviceTemplate: ServiceTemplate | null; documents: Document[]; reminders: Reminder[] },
): ClientDealWithRelations {
  return {
    ...serializeDeal(deal),
    client: deal.client,
    serviceTemplate: deal.serviceTemplate ? serializeServiceTemplate(deal.serviceTemplate) : null,
    documents: deal.documents,
    reminders: deal.reminders,
  };
}
