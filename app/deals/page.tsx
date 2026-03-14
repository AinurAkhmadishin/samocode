import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DealList } from "@/components/deals/deal-list";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/server/auth/get-session-user";
import { prisma } from "@/lib/prisma";
import { serializeDealWithRelations } from "@/lib/serializers";

export default async function DealsPage() {
  const user = await getSessionUser();
  const deals = await prisma.deal.findMany({
    where: {
      userId: user.id,
    },
    include: {
      client: true,
      serviceTemplate: true,
      documents: true,
      reminders: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const serializedDeals = deals.map(serializeDealWithRelations);

  return (
    <AppShell
      user={user}
      title="Сделки"
      description="Просматривайте активные сделки, статусы, документы и напоминания по каждому заказу."
      actions={
        <Button asChild>
          <Link href="/deals/new">Новая сделка</Link>
        </Button>
      }
    >
      <DealList deals={serializedDeals} />
    </AppShell>
  );
}