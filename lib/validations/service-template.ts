import { z } from "zod";

function normalizeNumericInput(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : "";
  }

  return String(value).replace(/\s+/g, "").replace(",", ".").trim();
}

function createNullableIntegerField(options: {
  invalidMessage: string;
  integerMessage: string;
  min: number;
  minMessage: string;
  max: number;
  maxMessage: string;
}) {
  return z
    .any()
    .transform(normalizeNumericInput)
    .refine((value) => value === "" || Number.isFinite(Number(value)), options.invalidMessage)
    .transform((value) => value === "" ? null : Number(value))
    .refine((value) => value === null || Number.isInteger(value), options.integerMessage)
    .refine((value) => value === null || value >= options.min, options.minMessage)
    .refine((value) => value === null || value <= options.max, options.maxMessage);
}

export const serviceTemplateSchema = z.object({
  id: z.string().cuid().optional().or(z.literal("")),
  title: z.string().trim().min(2, "Укажите название услуги").max(160, "Слишком длинное значение"),
  description: z.string().trim().max(1000, "Слишком длинное описание").optional().or(z.literal("")),
  price: z
    .any()
    .transform(normalizeNumericInput)
    .refine((value) => value !== "", "Укажите цену")
    .refine((value) => Number.isFinite(Number(value)), "Укажите цену числом")
    .transform((value) => Number(value))
    .refine((value) => value > 0, "Цена должна быть больше нуля"),
  prepaymentPercent: createNullableIntegerField({
    invalidMessage: "Укажите предоплату числом",
    integerMessage: "Укажите предоплату целым числом",
    min: 0,
    minMessage: "Предоплата не может быть меньше 0%",
    max: 100,
    maxMessage: "Предоплата не может быть больше 100%",
  }),
  deadlineDays: createNullableIntegerField({
    invalidMessage: "Укажите срок числом",
    integerMessage: "Укажите срок целым числом",
    min: 1,
    minMessage: "Срок должен быть не меньше 1 дня",
    max: 3650,
    maxMessage: "Слишком большое значение",
  }),
  unit: z.string().trim().max(40, "Слишком длинное значение").optional().or(z.literal("")),
});

export type ServiceTemplateFormInput = {
  id?: string;
  title: string;
  description: string;
  price: string;
  prepaymentPercent: string;
  deadlineDays: string;
  unit: string;
};

export type ServiceTemplateInput = z.output<typeof serviceTemplateSchema>;
