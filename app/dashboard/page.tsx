import { DealStatus, PaymentStatus } from "@prisma/client";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentDeals } from "@/components/dashboard/recent-deals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSessionUser } from "@/server/auth/get-session-user";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const sessionUser = await getSessionUser();

  const [activeDeals, unpaidDeals, recentDeals, reminders, paidDeals] = await Promise.all([
    prisma.deal.count({
      where: {
        userId: sessionUser.id,
        status: {
          in: [DealStatus.draft, DealStatus.sent, DealStatus.paid],
        },
      },
    }),
    prisma.deal.count({
      where: {
        userId: sessionUser.id,
        paymentStatus: {
          in: [PaymentStatus.unpaid, PaymentStatus.partial],
        },
      },
    }),
    prisma.deal.findMany({
      where: {
        userId: sessionUser.id,
      },
      include: {
        client: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    }),
    prisma.reminder.count({
      where: {
        userId: sessionUser.id,
        done: false,
      },
    }),
    prisma.deal.findMany({
      where: {
        userId: sessionUser.id,
        paymentStatus: PaymentStatus.paid,
        updatedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      select: {
        amount: true,
      },
    }),
  ]);

  const monthRevenue = paidDeals.reduce((sum, deal) => sum + Number(deal.amount), 0);

  return (
    <AppShell
      user={sessionUser}
      title="Обзор кабинета"
      description="Следите за активными сделками, оплатами, напоминаниями и последними изменениями по заказам."
      actions={
        <Button asChild>
          <a href="/deals/new">Новая сделка</a>
        </Button>
      }
    >
      <DashboardStats
        stats={{
          activeDeals,
          unpaidDeals,
          upcomingReminders: reminders,
          monthRevenue,
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentDeals deals={recentDeals} />
        <Card>
          <CardHeader>
            <CardTitle>Ближайший фокус месяца</CardTitle>
            <CardDescription>Всё ключевое по сделкам и оплатам собрано в одном компактном блоке.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-[24px] bg-secondary p-5">
              <p className="text-sm text-muted-foreground">Выручка за месяц</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(monthRevenue)}</p>
            </div>
            <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
              <p>Этот раздел нужен для ежедневного контроля: здесь меньше лишних сущностей и проще удерживать в голове текущую нагрузку.</p>
              <p>Фиксируйте новые сделки, проверяйте оплату клиентов и переходите к нужным документам в пару кликов.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
