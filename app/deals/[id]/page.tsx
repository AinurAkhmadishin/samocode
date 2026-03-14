import Link from "next/link";
import { notFound } from "next/navigation";
import { DocumentType } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DocumentActions } from "@/components/deals/document-actions";
import { ReminderList } from "@/components/deals/reminder-list";
import { DealForm } from "@/components/forms/deal-form";
import { ReminderForm } from "@/components/forms/reminder-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getSessionUser } from "@/server/auth/get-session-user";
import { prisma } from "@/lib/prisma";
import { serializeServiceTemplate } from "@/lib/serializers";

const documentLabels: Record<DocumentType, string> = {
  contract: "Договор",
  act: "Акт",
  invoice: "Счет",
};

const statusLabels: Record<string, string> = {
  draft: "Черновик",
  sent: "Отправлена",
  paid: "Оплачена",
  completed: "Завершена",
  cancelled: "Отменена",
};

const paymentStatusLabels: Record<string, string> = {
  unpaid: "Не оплачено",
  partial: "Частично оплачено",
  paid: "Оплачено",
};

export default async function DealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  const { id } = await params;

  const [deal, clients, templates] = await Promise.all([
    prisma.deal.findFirst({
      where: { id, userId: user.id },
      include: {
        client: true,
        serviceTemplate: true,
        documents: { orderBy: { createdAt: "desc" } },
        reminders: { orderBy: { scheduledFor: "asc" } },
      },
    }),
    prisma.client.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
    prisma.serviceTemplate.findMany({ where: { userId: user.id }, orderBy: { title: "asc" } }),
  ]);

  if (!deal) {
    notFound();
  }

  const serializedTemplates = templates.map(serializeServiceTemplate);

  return (
    <AppShell
      user={user}
      title={deal.title}
      description="Просматривайте детали сделки, обновляйте условия, формируйте документы и контролируйте следующие действия."
      actions={
        <Button asChild variant="outline">
          <Link href="/deals">Назад к сделкам</Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Краткая сводка</CardTitle>
              <CardDescription>Основные параметры сделки, клиента, суммы и срока выполнения.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Клиент</p>
                <p className="mt-2 font-semibold">{deal.client.name}</p>
              </div>
              <div className="rounded-[24px] bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Сумма</p>
                <p className="mt-2 font-semibold">{formatCurrency(deal.amount.toString())}</p>
              </div>
              <div className="rounded-[24px] bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Статусы</p>
                <div className="mt-2 flex gap-2">
                  <Badge>{statusLabels[deal.status] ?? deal.status}</Badge>
                  <Badge variant="outline">{paymentStatusLabels[deal.paymentStatus] ?? deal.paymentStatus}</Badge>
                </div>
              </div>
              <div className="rounded-[24px] bg-secondary p-4">
                <p className="text-sm text-muted-foreground">Срок</p>
                <p className="mt-2 font-semibold">{formatDate(deal.dueDate)}</p>
              </div>
            </CardContent>
          </Card>

          <details className="group rounded-[28px] border bg-card shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold">Редактирование сделки</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Откройте секцию, чтобы изменить условия, стоимость, статус и сроки.
                </p>
              </div>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-1 pb-1">
              <DealForm
                clients={clients}
                templates={serializedTemplates}
                hideHeader
                initialValues={{
                  id: deal.id,
                  clientId: deal.clientId,
                  serviceTemplateId: deal.serviceTemplateId ?? "",
                  title: deal.title,
                  description: deal.description ?? "",
                  amount: Number(deal.amount),
                  prepaymentAmount: deal.prepaymentAmount ? Number(deal.prepaymentAmount) : null,
                  status: deal.status,
                  paymentStatus: deal.paymentStatus,
                  startDate: deal.startDate ? new Date(deal.startDate).toISOString().slice(0, 10) : "",
                  dueDate: deal.dueDate ? new Date(deal.dueDate).toISOString().slice(0, 10) : "",
                }}
              />
            </div>
          </details>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Документы</CardTitle>
              <CardDescription>Сформируйте нужный документ по сделке и откройте уже созданные файлы в новой вкладке.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <DocumentActions dealId={deal.id} />
              <div className="space-y-3 pt-3">
                {deal.documents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Документы по этой сделке пока не создавались.</p>
                ) : (
                  deal.documents.map((document) => (
                    <Link
                      key={document.id}
                      href={document.fileUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-[20px] border px-4 py-3 text-sm hover:bg-secondary/40"
                    >
                      <span>{documentLabels[document.type]} - {document.docNumber}</span>
                      <span className="text-muted-foreground">{formatDate(document.generatedAt)}</span>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <ReminderForm dealId={deal.id} />
          <ReminderList reminders={deal.reminders} />
        </div>
      </div>
    </AppShell>
  );
}


