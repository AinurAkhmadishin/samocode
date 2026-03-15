"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { DealStatus, PaymentStatus } from "@prisma/client";
import { FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { updateDealStatus } from "@/server/actions/deals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import type { ClientDealWithRelations } from "@/lib/serializers";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

const statusMap: Record<DealStatus, { label: string; variant: "default" | "warning" | "success" | "danger" }> = {
  draft: { label: "Черновик", variant: "default" },
  sent: { label: "Отправлена", variant: "warning" },
  paid: { label: "Оплачена", variant: "success" },
  completed: { label: "Завершена", variant: "success" },
  cancelled: { label: "Отменена", variant: "danger" },
};

const paymentStatusMap: Record<PaymentStatus, string> = {
  unpaid: "Не оплачено",
  partial: "Частично оплачено",
  paid: "Оплачено",
};

const filterOptions = [
  { value: "all", label: "Все" },
  { value: "draft", label: "Черновики" },
  { value: "sent", label: "Отправлены" },
  { value: "awaiting_payment", label: "Ожидают оплаты" },
  { value: "paid", label: "Оплачены" },
  { value: "completed", label: "Завершены" },
  { value: "cancelled", label: "Отменены" },
] as const;

type DealFilterValue = (typeof filterOptions)[number]["value"];

type QuickAction =
  | {
      kind: "status";
      label: string;
      status: DealStatus;
      paymentStatus: PaymentStatus;
      variant?: "default" | "outline" | "ghost";
    }
  | {
      kind: "link";
      label: string;
      href: string;
      variant?: "default" | "outline" | "ghost";
    };

function matchesStatusFilter(deal: ClientDealWithRelations, filter: DealFilterValue) {
  switch (filter) {
    case "all":
      return true;
    case "awaiting_payment":
      return deal.status !== "draft" && deal.status !== "completed" && deal.status !== "cancelled" && deal.paymentStatus !== "paid";
    default:
      return deal.status === filter;
  }
}

function getQuickActions(deal: ClientDealWithRelations): { primary: QuickAction; secondary?: QuickAction } {
  const href = `/deals/${deal.id}`;

  switch (deal.status) {
    case "draft":
      return {
        primary: { kind: "status", label: "Отправить", status: "sent", paymentStatus: deal.paymentStatus, variant: "default" },
        secondary: { kind: "link", label: "Редактировать", href, variant: "ghost" },
      };
    case "sent":
      return {
        primary: { kind: "status", label: "Отметить оплату", status: "paid", paymentStatus: "paid", variant: "default" },
        secondary: { kind: "link", label: "Редактировать", href, variant: "ghost" },
      };
    case "paid":
      return {
        primary: { kind: "status", label: "Завершить", status: "completed", paymentStatus: "paid", variant: "default" },
        secondary: { kind: "link", label: "Открыть", href, variant: "ghost" },
      };
    case "completed":
      return {
        primary: { kind: "link", label: "Открыть", href, variant: "outline" },
      };
    case "cancelled":
      return {
        primary: { kind: "link", label: "Открыть", href, variant: "outline" },
      };
    default:
      return {
        primary: { kind: "link", label: "Открыть", href, variant: "outline" },
      };
  }
}

function ActionButton({ action, disabled, onStatus }: { action: QuickAction; disabled: boolean; onStatus: (status: DealStatus, paymentStatus: PaymentStatus) => void }) {
  if (action.kind === "link") {
    return (
      <Button asChild variant={action.variant ?? "outline"} size="sm">
        <Link href={action.href}>{action.label}</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={action.variant ?? "default"}
      size="sm"
      disabled={disabled}
      onClick={() => onStatus(action.status, action.paymentStatus)}
    >
      {action.label}
    </Button>
  );
}

export function DealList({ deals }: { deals: ClientDealWithRelations[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DealFilterValue>("all");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      const term = query.trim().toLowerCase();
      const matchesQuery = !term || [deal.title, deal.client.name, deal.description]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term));

      return matchesStatusFilter(deal, statusFilter) && matchesQuery;
    });
  }, [deals, query, statusFilter]);

  const handleQuickStatus = (id: string, status: DealStatus, paymentStatus: PaymentStatus) => {
    startTransition(async () => {
      const result = await updateDealStatus({ id, status, paymentStatus });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Статус сделки обновлён");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Все сделки</CardTitle>
        <CardDescription>Отслеживайте проекты, оплаты, документы и напоминания по каждому заказу.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию или клиенту" className="pl-10" />
          </div>
          <select
            className="h-11 rounded-2xl border bg-white px-4 text-sm"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as DealFilterValue)}
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Пока нет ни одной сделки"
            description="Создайте первую сделку, чтобы отслеживать статусы, оплаты, документы и напоминания в одном месте."
            action={(
              <Button asChild>
                <Link href="/deals/new">Создать сделку</Link>
              </Button>
            )}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((deal) => {
              const status = statusMap[deal.status];
              const actions = getQuickActions(deal);
              const dueDateLabel = deal.dueDate ? `срок ${formatDate(deal.dueDate)}` : "срок не указан";

              return (
                <div key={deal.id} className="rounded-[24px] border p-4 transition hover:border-foreground/20 hover:shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/deals/${deal.id}`} className="font-semibold hover:text-primary">{deal.title}</Link>
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <Badge variant="outline" className="bg-background text-muted-foreground">
                          {paymentStatusMap[deal.paymentStatus]}
                        </Badge>
                      </div>

                      <p className="mt-2 text-sm text-foreground">{deal.client.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatCurrency(deal.amount.toString())} · {dueDateLabel}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Документы: {deal.documents.length} · Напоминания: {deal.reminders.length}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <ActionButton
                        action={actions.primary}
                        disabled={isPending}
                        onStatus={(statusValue, paymentStatusValue) => handleQuickStatus(deal.id, statusValue, paymentStatusValue)}
                      />
                      {actions.secondary ? (
                        <ActionButton
                          action={actions.secondary}
                          disabled={isPending}
                          onStatus={(statusValue, paymentStatusValue) => handleQuickStatus(deal.id, statusValue, paymentStatusValue)}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
