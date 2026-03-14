import "server-only";

import { compare, hash } from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE, decodeSessionToken, encodeSessionToken } from "@/lib/session";
import type { AppUser } from "@/types";

type CurrentUserRecord = Awaited<ReturnType<typeof getCurrentUserRecord>>;

export function isProfileComplete(user: {
  profile:
    | {
        profession: string | null;
        fullName: string | null;
        inn: string | null;
      }
    | null;
}) {
  return Boolean(user.profile?.profession && user.profile?.fullName && user.profile?.inn);
}

function mapAppUser(user: NonNullable<CurrentUserRecord>): AppUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? user.login,
    image: user.avatarUrl,
    profileCompleted: isProfileComplete(user),
  };
}

export async function hashPassword(password: string) {
  return hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function createSession(userId: string) {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const token = await encodeSessionToken({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    expires: new Date(expiresAt),
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  return decodeSessionToken(token);
}

export async function getCurrentUserRecord() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  return prisma.user.findUnique({
    where: {
      id: session.userId,
    },
    include: {
      profile: true,
      businessDetails: true,
    },
  });
}

export async function getSessionUser() {
  const user = await getCurrentUserRecord();

  if (!user) {
    redirect("/login");
  }

  return mapAppUser(user);
}

export async function requireCurrentUser() {
  const user = await getCurrentUserRecord();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function redirectAuthenticatedUser() {
  const user = await getCurrentUserRecord();

  if (!user) {
    return;
  }

  redirect(isProfileComplete(user) ? "/dashboard" : "/onboarding");
}
