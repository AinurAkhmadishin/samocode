"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clientSchema, type ClientInput } from "@/lib/validations/client";
import { getSessionUser } from "@/server/auth/get-session-user";

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

export async function saveClient(input: ClientInput) {
  const user = await getSessionUser();
  const parsed = clientSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные клиента" };
  }

  const payload = {
    type: parsed.data.type,
    name: parsed.data.name,
    contactName: normalizeOptional(parsed.data.contactName),
    phone: normalizeOptional(parsed.data.phone),
    email: normalizeOptional(parsed.data.email),
    companyName: normalizeOptional(parsed.data.companyName),
    inn: normalizeOptional(parsed.data.inn),
    notes: normalizeOptional(parsed.data.notes),
  };

  if (parsed.data.id) {
    const client = await prisma.client.findFirst({
      where: {
        id: parsed.data.id,
        userId: user.id,
      },
    });

    if (!client) {
      return { success: false, error: "Клиент не найден" };
    }

    await prisma.client.update({
      where: {
        id: client.id,
      },
      data: payload,
    });
  } else {
    await prisma.client.create({
      data: {
        userId: user.id,
        ...payload,
      },
    });
  }

  revalidatePath("/clients");
  revalidatePath("/deals");

  return { success: true };
}

export async function deleteClient(id: string) {
  const user = await getSessionUser();

  const client = await prisma.client.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!client) {
    return { success: false, error: "Клиент не найден" };
  }

  await prisma.client.delete({
    where: {
      id: client.id,
    },
  });

  revalidatePath("/clients");
  revalidatePath("/deals");

  return { success: true };
}
