"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { dealSchema, dealStatusSchema, type DealInput, type DealStatusInput } from "@/lib/validations/deal";
import { getSessionUser } from "@/server/auth/get-session-user";

function toDate(value: string) {
  return value ? new Date(value) : null;
}

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

export async function saveDeal(input: DealInput) {
  const user = await getSessionUser();
  const parsed = dealSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные сделки" };
  }

  const client = await prisma.client.findFirst({
    where: {
      id: parsed.data.clientId,
      userId: user.id,
    },
  });

  if (!client) {
    return { success: false, error: "Клиент не найден" };
  }

  if (parsed.data.serviceTemplateId) {
    const template = await prisma.serviceTemplate.findFirst({
      where: {
        id: parsed.data.serviceTemplateId,
        userId: user.id,
      },
    });

    if (!template) {
      return { success: false, error: "Шаблон услуги не найден" };
    }
  }

  const payload = {
    clientId: parsed.data.clientId,
    serviceTemplateId: parsed.data.serviceTemplateId || null,
    title: parsed.data.title,
    description: normalizeOptional(parsed.data.description),
    amount: parsed.data.amount.toFixed(2),
    prepaymentAmount:
      parsed.data.prepaymentAmount !== null && parsed.data.prepaymentAmount !== undefined
        ? parsed.data.prepaymentAmount.toFixed(2)
        : null,
    status: parsed.data.status,
    paymentStatus: parsed.data.paymentStatus,
    startDate: toDate(parsed.data.startDate),
    dueDate: toDate(parsed.data.dueDate),
  };

  let dealId = parsed.data.id;

  if (parsed.data.id) {
    const deal = await prisma.deal.findFirst({
      where: {
        id: parsed.data.id,
        userId: user.id,
      },
    });

    if (!deal) {
      return { success: false, error: "Сделка не найдена" };
    }

    await prisma.deal.update({
      where: {
        id: deal.id,
      },
      data: payload,
    });
  } else {
    const deal = await prisma.deal.create({
      data: {
        userId: user.id,
        ...payload,
      },
    });

    dealId = deal.id;
  }

  revalidatePath("/deals");
  revalidatePath("/dashboard");
  if (dealId) {
    revalidatePath(`/deals/${dealId}`);
  }

  return { success: true, dealId };
}

export async function updateDealStatus(input: DealStatusInput) {
  const user = await getSessionUser();
  const parsed = dealStatusSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте параметры статуса" };
  }

  const deal = await prisma.deal.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
  });

  if (!deal) {
    return { success: false, error: "Сделка не найдена" };
  }

  await prisma.deal.update({
    where: {
      id: deal.id,
    },
    data: {
      status: parsed.data.status,
      paymentStatus: parsed.data.paymentStatus,
    },
  });

  revalidatePath("/deals");
  revalidatePath(`/deals/${deal.id}`);
  revalidatePath("/dashboard");

  return { success: true };
}
