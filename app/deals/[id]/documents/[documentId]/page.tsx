import { notFound } from "next/navigation";
import { DocumentViewer } from "@/components/documents/document-viewer";
import { generateDocumentHtml } from "@/server/documents/generate-document";
import { getSessionUser } from "@/server/auth/get-session-user";
import { prisma } from "@/lib/prisma";

const documentTitles = {
  contract: "Договор",
  act: "Акт",
  invoice: "Счет",
} as const;

export default async function DealDocumentPage({ params }: { params: Promise<{ id: string; documentId: string }> }) {
  const user = await getSessionUser();
  const { id, documentId } = await params;

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
    notFound();
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      profile: true,
      businessDetails: true,
    },
  });

  const title = `${documentTitles[document.type]} ${document.docNumber ?? document.id}`;
  const html = generateDocumentHtml({
    deal: document.deal,
    profile: currentUser?.profile ?? null,
    businessDetails: currentUser?.businessDetails ?? null,
    type: document.type,
    docNumber: document.docNumber ?? document.id,
    generatedAt: document.generatedAt ?? document.createdAt,
  });

  return <DocumentViewer title={title} html={html} pdfUrl={`/deals/${id}/documents/${documentId}/pdf`} />;
}