import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .min(6, "Укажите телефон")
  .max(24, "Слишком длинный телефон")
  .optional()
  .or(z.literal(""));

export const onboardingSchema = z.object({
  profession: z.string().trim().min(2, "Укажите профессию").max(120, "Слишком длинное значение"),
  fullName: z.string().trim().min(5, "Укажите ФИО").max(160, "Слишком длинное значение"),
  inn: z
    .string()
    .trim()
    .regex(/^\d{10,12}$/, "ИНН должен содержать 10 или 12 цифр"),
  phone: phoneSchema,
  city: z.string().trim().max(120, "Слишком длинное значение").optional().or(z.literal("")),
});

export const profileSchema = z.object({
  profession: z.string().trim().min(2, "Укажите профессию").max(120, "Слишком длинное значение"),
  fullName: z.string().trim().min(5, "Укажите ФИО").max(160, "Слишком длинное значение"),
  phone: phoneSchema,
  inn: z
    .string()
    .trim()
    .regex(/^\d{10,12}$/, "ИНН должен содержать 10 или 12 цифр"),
  city: z.string().trim().max(120, "Слишком длинное значение").optional().or(z.literal("")),
  telegram: z.string().trim().max(120, "Слишком длинное значение").optional().or(z.literal("")),
  website: z.string().trim().url("Укажите корректный URL").optional().or(z.literal("")),
  about: z.string().trim().max(1000, "Слишком длинное описание").optional().or(z.literal("")),
});

export const businessDetailsSchema = z.object({
  legalStatus: z.string().trim().min(2, "Укажите статус").max(40, "Слишком длинное значение"),
  displayName: z.string().trim().max(160, "Слишком длинное значение").optional().or(z.literal("")),
  signerName: z.string().trim().max(160, "Слишком длинное значение").optional().or(z.literal("")),
  emailForDocs: z.string().trim().email("Укажите корректный email").optional().or(z.literal("")),
  paymentPhone: phoneSchema,
  paymentBank: z.string().trim().max(160, "Слишком длинное значение").optional().or(z.literal("")),
  paymentCardMask: z.string().trim().max(32, "Слишком длинное значение").optional().or(z.literal("")),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type BusinessDetailsInput = z.infer<typeof businessDetailsSchema>;
