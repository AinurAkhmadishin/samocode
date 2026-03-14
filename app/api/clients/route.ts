import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getCurrentUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { clientSchema } from "@/lib/validations/client";

function normalizeOptional(value?: string | null) {
  return value?.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  const user = await getCurrentUserRecord();

  if (!user) {
    return NextResponse.json({ success: false, error: "Не авторизован" }, { status: 401 });
  }

  const input = await request.json();
  const parsed = clientSchema.safeParse(input);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Проверьте данные клиента" },
      { status: 400 },
    );
  }

  const payload = {
    type: parsed.data.type,
    name: parsed.data.name,
    contactName: normalizeOptional(parsed.data.contactName),
    phone: normalizeOptional(parsed.data.phone),
    email: normalizeOptional(parsed.data.email),
    companyName: normalizeOptional(parsed.data.companyName),
    inn: normalizeOptional(parsed.data.inn),
    notes: normalizeOptional(parsed.data.notes),
  };

  if (parsed.data.id) {
    const client = await prisma.client.findFirst({
      where: {
        id: parsed.data.id,
        userId: user.id,
      },
    });

    if (!client) {
      return NextResponse.json({ success: false, error: "Клиент не найден" }, { status: 404 });
    }

    await prisma.client.update({
      where: {
        id: client.id,
      },
      data: payload,
    });
  } else {
    await prisma.client.create({
      data: {
        userId: user.id,
        ...payload,
      },
    });
  }

  revalidatePath("/clients");
  revalidatePath("/deals");

  return NextResponse.json({ success: true });
}
