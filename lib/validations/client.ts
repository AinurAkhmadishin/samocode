import { ClientType } from "@prisma/client";
import { z } from "zod";

export const clientSchema = z.object({
  id: z.string().cuid().optional().or(z.literal("")),
  type: z.nativeEnum(ClientType),
  name: z.string().trim().min(2, "Укажите имя клиента").max(160, "Слишком длинное значение"),
  contactName: z.string().trim().max(160, "Слишком длинное значение").optional().or(z.literal("")),
  phone: z.string().trim().max(24, "Слишком длинное значение").optional().or(z.literal("")),
  email: z.string().trim().email("Укажите корректный email").optional().or(z.literal("")),
  companyName: z.string().trim().max(160, "Слишком длинное значение").optional().or(z.literal("")),
  inn: z
    .string()
    .trim()
    .regex(/^\d{10,12}$/, "ИНН должен содержать 10 или 12 цифр")
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(1000, "Слишком длинный комментарий").optional().or(z.literal("")),
});

export type ClientInput = z.infer<typeof clientSchema>;
