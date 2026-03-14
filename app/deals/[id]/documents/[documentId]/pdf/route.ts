import { NextResponse } from "next/server";
import { generateDocumentHtml } from "@/server/documents/generate-document";
import { generatePdfFromHtml } from "@/server/documents/pdf";
import { getSessionUser } from "@/server/auth/get-session-user";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const documentTitles = {
  contract: "Договор",
  act: "Акт",
  invoice: "Счет",
} as const;

export async function GET(_: Request, context: { params: Promise<{ id: string; documentId: string }> }) {
  const user = await getSessionUser();
  const { id, documentId } = await context.params;

  const document = await prisma.document.findFirst({
    where: {
      id: documentId,
      dealId: id,
      userId: user.id,
    },
    include: {
      deal: {
        include: {
          client: true,
          serviceTemplate: true,
        },
      },
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Документ не найден" }, { status: 404 });
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      businessDetails: true,
    },
  });

  const html = generateDocumentHtml({
    deal: document.deal,
    profile: currentUser?.profile ?? null,
    businessDetails: currentUser?.businessDetails ?? null,
    type: document.type,
    docNumber: document.docNumber ?? document.id,
    generatedAt: document.generatedAt ?? document.createdAt,
  });

  const pdf = await generatePdfFromHtml(html);
  const body = new Uint8Array(pdf);
  const filename = `${documentTitles[document.type]}-${document.docNumber ?? document.id}.pdf`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "no-store",
    },
  });
}