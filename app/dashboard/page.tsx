import Link from "next/link";
import { DealStatus, PaymentStatus } from "@prisma/client";
import { AlertCircle, ArrowRight, CheckCircle2, FileText, Plus, Settings, UsersRound } from "lucide-react";
import { isProfileComplete, getCurrentUserRecord } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
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
    { label: "ИНН", done: Boolean(user.profile?.inn) },
    { label: "Вид деятельности", done: Boolean(user.profile?.profession) },
    { label: "Email для документов", done: Boolean(user.businessDetails?.emailForDocs) },
    {
      label: "Реквизиты",
      done: Boolean(user.businessDetails?.paymentBank && user.businessDetails?.paymentPhone && user.businessDetails?.paymentCardMask),
    },
  ];

  const completedProfileChecks = profileChecks.filter((item) => item.done).length;
  const profileProgress = Math.round((completedProfileChecks / profileChecks.length) * 100);
  const remainingProfileChecks = profileChecks.filter((item) => !item.done);
  const remainingProfileSteps = remainingProfileChecks.length;

  const attentionItems = [
    ...(profileProgress < 100
      ? [
          {
            title: "Заполнить реквизиты и профиль",
            description: "Сейчас кабинет заполнен не полностью. Это влияет на корректность документов.",
            href: "/settings",
            badge: `${profileProgress}%`,
            tone: "high" as const,
          },
        ]
      : []),
    ...(dealsWithoutDocuments > 0
      ? [
          {
            title: "Есть сделки без документов",
            description: `По ${dealsWithoutDocuments} ${dealsWithoutDocuments === 1 ? "сделке" : dealsWithoutDocuments < 5 ? "сделкам" : "сделкам"} ещё не сформирован договор или акт.`,
            href: "/deals",
            badge: dealsWithoutDocuments.toString(),
            tone: "high" as const,
          },
        ]
      : []),
    ...(awaitingPayment > 0
      ? [
          {
            title: "Проверить оплаты",
            description: `${awaitingPayment} ${awaitingPayment === 1 ? "сделка" : awaitingPayment < 5 ? "сделки" : "сделок"} ещё не отмечены как оплаченные.`,
            href: "/deals",
            badge: awaitingPayment.toString(),
            tone: "medium" as const,
          },
        ]
      : []),
    ...reminders.map((reminder) => ({
      title: "Напоминание по сделке",
      description: `Сделка "${reminder.deal.title}" требует следующего шага.`,
      href: "/deals",
      badge: formatDate(reminder.scheduledFor),
      tone: "low" as const,
    })),
  ].slice(0, 4);

  const quickActions = [
    {
      title: "Новая сделка",
      description: "Открыть карточку сделки и сразу перейти к созданию заказа.",
      href: "/deals/new",
      icon: Plus,
    },
    {
      title: "Новый клиент",
      description: "Добавить клиента для последующей работы в сделках и документах.",
      href: "/clients",
      icon: UsersRound,
    },
    {
      title: "Заполнить реквизиты",
      description: "Подготовить профиль для корректного формирования документов.",
      href: "/settings",
      icon: Settings,
    },
    {
      title: "Сформировать документ",
      description: "Быстро перейти к созданию договора, акта или счёта.",
      href: "/deals",
      icon: FileText,
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
      title="Обзор кабинета"
      description="Следите за клиентами, сделками, оплатами и следующими шагами в одном месте."
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
            <CardDescription>Заполните основные данные, чтобы документы и сделки оформлялись корректно.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-[24px] bg-secondary p-4">
              <div className="h-3 overflow-hidden rounded-full bg-white/70">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${profileProgress}%` }} />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">Профиль заполнен на {profileProgress}%</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {remainingProfileSteps > 0
                  ? `Осталось ${remainingProfileSteps} ${remainingProfileSteps === 1 ? "шаг" : remainingProfileSteps < 5 ? "шага" : "шагов"}, чтобы подготовить кабинет к работе.`
                  : "Все основные данные заполнены. Кабинет готов к работе."}
              </p>
            </div>
            <div className="mt-5">
              <Button asChild>
                <Link href="/settings">Заполнить профиль</Link>
              </Button>
            </div>
            <div className="mt-5 rounded-[24px] border p-4">
              <p className="text-sm font-medium text-foreground">
                {remainingProfileSteps > 0 ? "Осталось заполнить" : "Основные данные заполнены"}
              </p>
              {remainingProfileSteps > 0 ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {remainingProfileChecks.map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-[20px] bg-secondary/40 px-4 py-3 text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-3 rounded-[20px] bg-secondary/40 px-4 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Профиль и реквизиты готовы для работы с документами и сделками.</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
            <CardDescription>Создавайте основные сущности и переходите к работе без лишних шагов.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map(({ title, description, href, icon: Icon }) => (
              <Link
                key={title}
                href={href}
                className="group cursor-pointer rounded-[24px] border px-4 py-4 transition duration-200 hover:border-primary/45 hover:bg-secondary/40 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary transition group-hover:bg-primary/10">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="font-semibold">{title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
                  </div>
                  <div className="mt-0.5 rounded-full border border-transparent p-1.5 text-muted-foreground transition group-hover:border-primary/15 group-hover:bg-background group-hover:text-foreground">
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
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
            <CardTitle>Требуют внимания</CardTitle>
            <CardDescription>Следующие шаги по сделкам, оплатам и документам.</CardDescription>
          </CardHeader>
          <CardContent>
            {attentionItems.length > 0 ? (
              <div className="space-y-3">
                {attentionItems.map((item) => (
                  <Link
                    key={`${item.title}-${item.description}`}
                    href={item.href}
                    className={`block rounded-[24px] border px-4 py-4 transition hover:border-primary/40 hover:bg-secondary/30 ${
                      item.tone === "high"
                        ? "border-primary/20 bg-secondary/20"
                        : item.tone === "medium"
                          ? "bg-background"
                          : "border-dashed bg-background/70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                      <Badge variant={item.tone === "low" ? "outline" : "warning"}>{item.badge}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] bg-secondary p-5">
                <p className="text-sm font-medium text-foreground">Сейчас всё под контролем</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  По активным сделкам нет незавершённых шагов.
                </p>
              </div>
            )}

            <div className="mt-5 rounded-[24px] border border-dashed border-border/60 bg-background/40 p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Подсказка</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground/90">
                    Когда профиль заполнен, договоры, акты и счета формируются аккуратнее и требуют меньше ручных правок.
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
