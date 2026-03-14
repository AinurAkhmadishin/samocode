"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { reminderDeleteSchema, reminderSchema, reminderToggleSchema, type ReminderInput } from "@/lib/validations/reminder";
import { getSessionUser } from "@/server/auth/get-session-user";

export async function saveReminder(input: ReminderInput) {
  const user = await getSessionUser();
  const parsed = reminderSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "��������� ������ �����������" };
  }

  const deal = await prisma.deal.findFirst({
    where: {
      id: parsed.data.dealId,
      userId: user.id,
    },
  });

  if (!deal) {
    return { success: false, error: "������ �� �������" };
  }

  await prisma.reminder.create({
    data: {
      userId: user.id,
      dealId: deal.id,
      type: parsed.data.type,
      scheduledFor: new Date(parsed.data.scheduledFor),
    },
  });

  revalidatePath(`/deals/${deal.id}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function toggleReminder(payload: { id: string; done: boolean }) {
  const user = await getSessionUser();
  const parsed = reminderToggleSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, error: "������������ ������" };
  }

  const reminder = await prisma.reminder.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
  });

  if (!reminder) {
    return { success: false, error: "����������� �� �������" };
  }

  await prisma.reminder.update({
    where: {
      id: reminder.id,
    },
    data: {
      done: parsed.data.done,
    },
  });

  revalidatePath(`/deals/${reminder.dealId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

export async function deleteReminder(payload: { id: string }) {
  const user = await getSessionUser();
  const parsed = reminderDeleteSchema.safeParse(payload);

  if (!parsed.success) {
    return { success: false, error: "������������ ������" };
  }

  const reminder = await prisma.reminder.findFirst({
    where: {
      id: parsed.data.id,
      userId: user.id,
    },
  });

  if (!reminder) {
    return { success: false, error: "����������� �� �������" };
  }

  await prisma.reminder.delete({
    where: {
      id: reminder.id,
    },
  });

  revalidatePath(`/deals/${reminder.dealId}`);
  revalidatePath("/dashboard");

  return { success: true };
}

