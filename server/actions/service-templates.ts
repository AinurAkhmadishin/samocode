"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serviceTemplateSchema, type ServiceTemplateInput } from "@/lib/validations/service-template";
import { getSessionUser } from "@/server/auth/get-session-user";

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

export async function saveServiceTemplate(input: ServiceTemplateInput) {
  const user = await getSessionUser();
  const parsed = serviceTemplateSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные услуги" };
  }

  const payload = {
    title: parsed.data.title,
    description: normalizeOptional(parsed.data.description),
    price: parsed.data.price.toFixed(2),
    prepaymentPercent: parsed.data.prepaymentPercent ?? null,
    deadlineDays: parsed.data.deadlineDays ?? null,
    unit: normalizeOptional(parsed.data.unit),
  };

  if (parsed.data.id) {
    const record = await prisma.serviceTemplate.findFirst({
      where: {
        id: parsed.data.id,
        userId: user.id,
      },
    });

    if (!record) {
      return { success: false, error: "Шаблон услуги не найден" };
    }

    await prisma.serviceTemplate.update({
      where: {
        id: record.id,
      },
      data: payload,
    });
  } else {
    await prisma.serviceTemplate.create({
      data: {
        userId: user.id,
        ...payload,
      },
    });
  }

  revalidatePath("/services");
  revalidatePath("/deals");

  return { success: true };
}

export async function deleteServiceTemplate(id: string) {
  const user = await getSessionUser();

  const record = await prisma.serviceTemplate.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!record) {
    return { success: false, error: "Шаблон услуги не найден" };
  }

  await prisma.serviceTemplate.delete({
    where: {
      id: record.id,
    },
  });

  revalidatePath("/services");
  revalidatePath("/deals");

  return { success: true };
}
