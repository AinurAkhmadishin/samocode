import { AppShell } from "@/components/layout/app-shell";
import { ClientList } from "@/components/clients/client-list";
import { getSessionUser } from "@/server/auth/get-session-user";
import { prisma } from "@/lib/prisma";

export default async function ClientsPage() {
  const user = await getSessionUser();
  const clients = await prisma.client.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <AppShell
      user={user}
      title="Клиенты"
      description="Храните контакты заказчиков, быстро находите их и используйте в новых сделках."
    >
      <ClientList clients={clients} />
    </AppShell>
  );
}
