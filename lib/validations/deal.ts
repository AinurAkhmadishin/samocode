import { DealStatus, PaymentStatus } from "@prisma/client";
import { z } from "zod";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((value) => (value ? value : ""));

export const dealSchema = z.object({
  id: z.string().cuid().optional().or(z.literal("")),
  clientId: z.string().cuid("Некорректный клиент"),
  serviceTemplateId: z.string().cuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Укажите название сделки").max(160, "Слишком длинное значение"),
  description: z.string().trim().max(2000, "Слишком длинное описание").optional().or(z.literal("")),
  amount: z.coerce.number().positive("Сумма должна быть больше нуля"),
  prepaymentAmount: z.coerce.number().min(0).optional().nullable(),
  status: z.nativeEnum(DealStatus).default(DealStatus.draft),
  paymentStatus: z.nativeEnum(PaymentStatus).default(PaymentStatus.unpaid),
  startDate: optionalDate,
  dueDate: optionalDate,
});

export const dealStatusSchema = z.object({
  id: z.string().cuid(),
  status: z.nativeEnum(DealStatus),
  paymentStatus: z.nativeEnum(PaymentStatus),
});

export type DealFormInput = z.input<typeof dealSchema>;
export type DealInput = z.output<typeof dealSchema>;
export type DealStatusInput = z.infer<typeof dealStatusSchema>;
