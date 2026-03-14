import { z } from "zod";

const loginField = z
  .string()
  .trim()
  .min(3, "Логин должен содержать минимум 3 символа")
  .max(32, "Логин должен содержать не больше 32 символов")
  .regex(/^[a-zA-Z0-9_.-]+$/, "Используйте только латинские буквы, цифры, ., _ и -");

const passwordField = z
  .string()
  .min(4, "Пароль должен содержать минимум 4 символа")
  .max(72, "Пароль должен содержать не больше 72 символов");

export const loginSchema = z.object({
  login: loginField,
  password: passwordField,
});

export const registerSchema = z
  .object({
    login: loginField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Пароли не совпадают",
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
