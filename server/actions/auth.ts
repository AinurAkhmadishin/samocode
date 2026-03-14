"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, hashPassword, isProfileComplete, verifyPassword } from "@/lib/auth";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/lib/validations/auth";

const invalidCredentialsMessage = "Неверный логин или пароль";

export async function loginUser(input: LoginInput) {
  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? invalidCredentialsMessage };
  }

  const user = await prisma.user.findUnique({
    where: {
      login: parsed.data.login,
    },
    include: {
      profile: true,
    },
  });

  if (!user) {
    return { success: false, error: invalidCredentialsMessage };
  }

  const passwordIsValid = await verifyPassword(parsed.data.password, user.passwordHash);

  if (!passwordIsValid) {
    return { success: false, error: invalidCredentialsMessage };
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  await createSession(user.id);
  revalidatePath("/", "layout");

  return {
    success: true,
    redirectTo: isProfileComplete(user) ? "/dashboard" : "/onboarding",
  };
}

export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Не удалось создать аккаунт" };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      login: parsed.data.login,
    },
  });

  if (existingUser) {
    return { success: false, error: "Этот логин уже занят" };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      login: parsed.data.login,
      passwordHash,
      name: parsed.data.login,
      lastLoginAt: new Date(),
      profile: {
        create: {},
      },
    },
  });

  await createSession(user.id);
  revalidatePath("/", "layout");

  return {
    success: true,
    redirectTo: "/onboarding",
  };
}

export async function logoutUser() {
  await clearSession();
  revalidatePath("/", "layout");

  return { success: true };
}
