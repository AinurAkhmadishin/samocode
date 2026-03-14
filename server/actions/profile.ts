"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { businessDetailsSchema, onboardingSchema, profileSchema, type BusinessDetailsInput, type OnboardingInput, type ProfileInput } from "@/lib/validations/profile";
import { getSessionUser } from "@/server/auth/get-session-user";

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

export async function saveOnboarding(input: OnboardingInput) {
  const user = await getSessionUser();
  const parsed = onboardingSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные профиля" };
  }

  await prisma.profile.upsert({
    where: {
      userId: user.id,
    },
    update: {
      profession: parsed.data.profession,
      fullName: parsed.data.fullName,
      inn: parsed.data.inn,
      phone: normalizeOptional(parsed.data.phone),
      city: normalizeOptional(parsed.data.city),
    },
    create: {
      userId: user.id,
      profession: parsed.data.profession,
      fullName: parsed.data.fullName,
      inn: parsed.data.inn,
      phone: normalizeOptional(parsed.data.phone),
      city: normalizeOptional(parsed.data.city),
    },
  });

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return { success: true };
}

export async function updateProfile(input: ProfileInput) {
  const user = await getSessionUser();
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные профиля" };
  }

  await prisma.profile.upsert({
    where: {
      userId: user.id,
    },
    update: {
      profession: parsed.data.profession,
      fullName: parsed.data.fullName,
      phone: normalizeOptional(parsed.data.phone),
      inn: parsed.data.inn,
      city: normalizeOptional(parsed.data.city),
      telegram: normalizeOptional(parsed.data.telegram),
      website: normalizeOptional(parsed.data.website),
      about: normalizeOptional(parsed.data.about),
    },
    create: {
      userId: user.id,
      profession: parsed.data.profession,
      fullName: parsed.data.fullName,
      phone: normalizeOptional(parsed.data.phone),
      inn: parsed.data.inn,
      city: normalizeOptional(parsed.data.city),
      telegram: normalizeOptional(parsed.data.telegram),
      website: normalizeOptional(parsed.data.website),
      about: normalizeOptional(parsed.data.about),
    },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function updateBusinessDetails(input: BusinessDetailsInput) {
  const user = await getSessionUser();
  const parsed = businessDetailsSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте реквизиты" };
  }

  await prisma.businessDetails.upsert({
    where: {
      userId: user.id,
    },
    update: {
      legalStatus: parsed.data.legalStatus,
      displayName: normalizeOptional(parsed.data.displayName),
      signerName: normalizeOptional(parsed.data.signerName),
      emailForDocs: normalizeOptional(parsed.data.emailForDocs),
      paymentPhone: normalizeOptional(parsed.data.paymentPhone),
      paymentBank: normalizeOptional(parsed.data.paymentBank),
      paymentCardMask: normalizeOptional(parsed.data.paymentCardMask),
    },
    create: {
      userId: user.id,
      legalStatus: parsed.data.legalStatus,
      displayName: normalizeOptional(parsed.data.displayName),
      signerName: normalizeOptional(parsed.data.signerName),
      emailForDocs: normalizeOptional(parsed.data.emailForDocs),
      paymentPhone: normalizeOptional(parsed.data.paymentPhone),
      paymentBank: normalizeOptional(parsed.data.paymentBank),
      paymentCardMask: normalizeOptional(parsed.data.paymentCardMask),
    },
  });

  revalidatePath("/settings");
  revalidatePath("/deals");

  return { success: true };
}
