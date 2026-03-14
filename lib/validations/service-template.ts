import { z } from "zod";

export const serviceTemplateSchema = z.object({
  id: z.string().cuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Укажите название услуги").max(160, "Слишком длинное значение"),
  description: z.string().trim().max(1000, "Слишком длинное описание").optional().or(z.literal("")),
  price: z.coerce.number().positive("Цена должна быть больше нуля"),
  prepaymentPercent: z.coerce.number().int().min(0).max(100).optional().nullable(),
  deadlineDays: z.coerce.number().int().min(1).max(3650).optional().nullable(),
  unit: z.string().trim().max(40, "Слишком длинное значение").optional().or(z.literal("")),
});

export type ServiceTemplateFormInput = z.input<typeof serviceTemplateSchema>;
export type ServiceTemplateInput = z.output<typeof serviceTemplateSchema>;
