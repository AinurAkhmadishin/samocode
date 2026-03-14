import type { BusinessDetails, Client, Deal, DocumentType, Profile, ServiceTemplate } from "@prisma/client";
import { renderDocumentTemplate } from "@/server/documents/templates";

export function generateDocumentHtml(params: {
  deal: Deal & { client: Client; serviceTemplate: ServiceTemplate | null };
  profile: Profile | null;
  businessDetails: BusinessDetails | null;
  type: DocumentType;
  docNumber: string;
  generatedAt: Date;
}) {
  return renderDocumentTemplate(params);
}

