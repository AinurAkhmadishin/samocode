import Link from "next/link";
import { DealStatus, PaymentStatus } from "@prisma/client";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, Plus, Settings, UsersRound, WalletCards } from "lucide-react";
import { isProfileComplete, getCurrentUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { RecentDeals } from "@/components/dashboard/recent-deals";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const activeDealStatuses = [DealStatus.draft, DealStatus.sent];
const openDealStatuses = [DealStatus.draft, DealStatus.sent, DealStatus.paid];

export default async function DashboardPage() {
  const user = await getCurrentUserRecord();

  if (!user) {
    return null;
  }

  const [clientCount, activeDeals, awaitingPayment, recentDeals, reminders, dealsWithoutDocuments, paidDeals] =
    await Promise.all([
      prisma.client.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.deal.count({
        where: {
          userId: user.id,
          status: {
            in: activeDealStatuses,
          },
        },
      }),
      prisma.deal.count({
        where: {
          userId: user.id,
          status: {
            in: openDealStatuses,
          },
          paymentStatus: {
            in: [PaymentStatus.unpaid, PaymentStatus.partial],
          },
        },
      }),
      prisma.deal.findMany({
        where: {
          userId: user.id,
        },
        include: {
          client: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      }),
      prisma.reminder.findMany({
        where: {
          userId: user.id,
          done: false,
        },
        include: {
          deal: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          scheduledFor: "asc",
        },
        take: 3,
      }),
      prisma.deal.count({
        where: {
          userId: user.id,
          status: {
            in: openDealStatuses,
          },
          documents: {
            none: {},
          },
        },
      }),
      prisma.deal.findMany({
        where: {
          userId: user.id,
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

  const profileChecks = [
    { label: "Профессия", done: Boolean(user.profile?.profession) },
    { label: "ФИО", done: Boolean(user.profile?.fullName) },
    { label: "ИНН", done: Boolean(user.profile?.inn) },
    { label: "Имя в документах", done: Boolean(user.businessDetails?.displayName) },
    { label: "Подписант", done: Boolean(user.businessDetails?.signerName) },
    { label: "Email для документов", done: Boolean(user.businessDetails?.emailForDocs) },
  ];

  const completedProfileChecks = profileChecks.filter((item) => item.done).length;
  const profileProgress = Math.round((completedProfileChecks / profileChecks.length) * 100);

  const attentionItems = [
    ...(profileProgress < 100
      ? [
          {
            title: "Заполнить реквизиты и профиль",
            description: `Сейчас заполнено ${completedProfileChecks} из ${profileChecks.length} полей. Это влияет на готовность документов.`,
            href: "/settings",
            badge: `${profileProgress}%`,
          },
        ]
      : []),
    ...(clientCount === 0
      ? [
          {
            title: "Добавить первого клиента",
            description: "Без клиента не получится быстро собрать первую полноценную сделку и документы.",
            href: "/clients",
            badge: "Важно",
          },
        ]
      : []),
    ...(dealsWithoutDocuments > 0
      ? [
          {
            title: "Есть сделки без документов",
            description: `${dealsWithoutDocuments} ${dealsWithoutDocuments === 1 ? "сделка ждёт" : dealsWithoutDocuments < 5 ? "сделки ждут" : "сделок ждут"} договор или акт.`,
            href: "/deals",
            badge: dealsWithoutDocuments.toString(),
          },
        ]
      : []),
    ...(awaitingPayment > 0
      ? [
          {
            title: "Проверить оплаты",
            description: `${awaitingPayment} ${awaitingPayment === 1 ? "сделка" : awaitingPayment < 5 ? "сделки" : "сделок"} ещё не оплачены полностью.`,
            href: "/deals",
            badge: awaitingPayment.toString(),
          },
        ]
      : []),
    ...reminders.map((reminder) => ({
      title: "Напоминание по сделке",
      description: `${reminder.deal.title} · ${formatDate(reminder.scheduledFor)}`,
      href: "/deals",
      badge: "Срок",
    })),
  ].slice(0, 4);

  const quickActions = [
    {
      title: "Новая сделка",
      description: "Открыть карточку сделки и сразу перейти к сумме, срокам и документам.",
      href: "/deals/new",
      icon: Plus,
    },
    {
      title: "Клиенты",
      description: "Добавить клиента или быстро перейти к существующим контактам.",
      href: "/clients",
      icon: UsersRound,
    },
    {
      title: "Реквизиты и профиль",
      description: "Дозаполнить данные, которые нужны для договора, акта и рабочего профиля.",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Сделки на оплате",
      description: "Проверить, кому уже пора напомнить про оплату или закрытие документов.",
      href: "/deals",
      icon: WalletCards,
    },
  ];

  return (
    <AppShell
      user={{
        id: user.id,
        email: user.email,
        name: user.name ?? user.login,
        image: user.avatarUrl,
        profileCompleted: isProfileComplete(user),
      }}
      title="Рабочий кабинет"
      description="Проверяйте прогресс профиля, переходите к быстрым действиям и сразу видьте, что требует внимания по сделкам и документам."
      actions={
        <Button asChild>
          <Link href="/deals/new">Новая сделка</Link>
        </Button>
      }
    >
      <DashboardStats
        stats={{
          clientsCount: clientCount,
          activeDeals,
          awaitingPayment,
          monthRevenue,
        }}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center gap-3">
              <CardTitle>Статус профиля</CardTitle>
              <Badge variant={profileProgress === 100 ? "success" : "warning"}>{profileProgress}% заполнено</Badge>
            </div>
            <CardDescription>Чем полнее профиль и реквизиты, тем меньше ручной работы при создании договора и акта.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-[24px] bg-secondary p-4">
              <div className="h-3 overflow-hidden rounded-full bg-white/70">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${profileProgress}%` }} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Заполнено {completedProfileChecks} из {profileChecks.length} ключевых полей.
              </p>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {profileChecks.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[20px] border px-4 py-3 text-sm">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  )}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Самые частые переходы после входа: создать, проверить, дозаполнить.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group rounded-[24px] border px-4 py-4 transition hover:border-primary/40 hover:bg-secondary/30"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="font-semibold">{title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentDeals deals={recentDeals} />
        <Card>
          <CardHeader>
            <CardTitle>{attentionItems.length > 0 ? "Требуют внимания" : "Что сделать дальше"}</CardTitle>
            <CardDescription>
              {attentionItems.length > 0
                ? "Список собран из реальных статусов профиля, сделок, оплат и напоминаний."
                : "Сейчас критичных задач нет. Можно продолжить настройку кабинета или завести следующую сделку."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attentionItems.length > 0 ? (
              <div className="space-y-3">
                {attentionItems.map((item) => (
                  <Link
                    key={`${item.title}-${item.description}`}
                    href={item.href}
                    className="block rounded-[24px] border px-4 py-4 transition hover:border-primary/40 hover:bg-secondary/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge variant="warning">{item.badge}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-secondary p-5">
                <p className="text-sm font-medium text-foreground">База уже выглядит собранно</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Добавьте новую сделку или проверьте раздел документов, чтобы поддерживать рабочий ритм без хвостов.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link href="/deals/new">Создать сделку</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/deals">Открыть сделки</Link>
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-5 rounded-[24px] border border-dashed p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Логика статусов теперь разделена</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Сделка в работе показывает текущую нагрузку, а ожидание оплаты отражает только денежный статус. Метрики не дублируют друг друга.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
