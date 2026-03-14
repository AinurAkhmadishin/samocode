"use server";

import { DocumentType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/server/auth/get-session-user";

const generateSchema = z.object({
  dealId: z.string().cuid(),
  type: z.nativeEnum(DocumentType),
});

export async function generateDocument(input: { dealId: string; type: DocumentType }) {
  const user = await getSessionUser();
  const parsed = generateSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, error: "Проверьте данные документа" };
  }

  const deal = await prisma.deal.findFirst({
    where: {
      id: parsed.data.dealId,
      userId: user.id,
    },
  });

  if (!deal) {
    return { success: false, error: "Сделка не найдена" };
  }

  const count = await prisma.document.count({
    where: {
      userId: user.id,
      type: parsed.data.type,
    },
  });

  const document = await prisma.document.create({
    data: {
      userId: user.id,
      dealId: deal.id,
      type: parsed.data.type,
      docNumber: `${parsed.data.type.toUpperCase()}-${String(count + 1).padStart(4, "0")}`,
      generatedAt: new Date(),
    },
  });

  await prisma.document.update({
    where: {
      id: document.id,
    },
    data: {
      fileUrl: `/deals/${deal.id}/documents/${document.id}`,
    },
  });

  revalidatePath(`/deals/${deal.id}`);

  return { success: true, documentId: document.id, url: `/deals/${deal.id}/documents/${document.id}` };
}