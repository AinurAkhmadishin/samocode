import { ReminderType } from "@prisma/client";
import { z } from "zod";

export const reminderSchema = z.object({
  id: z.string().cuid().optional(),
  dealId: z.string().cuid("Некорректная сделка"),
  type: z.nativeEnum(ReminderType),
  scheduledFor: z.string().min(1, "Укажите дату"),
});

export const reminderToggleSchema = z.object({
  id: z.string().cuid(),
  done: z.boolean(),
});

export const reminderDeleteSchema = z.object({
  id: z.string().cuid(),
});

export type ReminderInput = z.infer<typeof reminderSchema>;
