import { AppShell } from "@/components/layout/app-shell";
import { ServiceTemplateList } from "@/components/services/service-template-list";
import { getSessionUser } from "@/server/auth/get-session-user";
import { prisma } from "@/lib/prisma";
import { serializeServiceTemplate } from "@/lib/serializers";

export default async function ServicesPage() {
  const user = await getSessionUser();
  const templates = await prisma.serviceTemplate.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const serializedTemplates = templates.map(serializeServiceTemplate);

  return (
    <AppShell
      user={user}
      title="Шаблоны услуг"
      description="Подготовьте типовые услуги, цены и сроки, чтобы быстрее оформлять сделки."
    >
      <ServiceTemplateList templates={serializedTemplates} />
    </AppShell>
  );
}
