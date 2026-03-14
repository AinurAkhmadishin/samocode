"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import type { Deal, PaymentStatus } from "@prisma/client";
import { FileText, Search } from "lucide-react";
import { toast } from "sonner";
import { updateDealStatus } from "@/server/actions/deals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import type { ClientDealWithRelations } from "@/lib/serializers";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "warning" | "success" | "danger" }> = {
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

export function DealList({ deals }: { deals: ClientDealWithRelations[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return deals.filter((deal) => {
      const matchesStatus = statusFilter === "all" || deal.status === statusFilter;
      const term = query.trim().toLowerCase();
      const matchesQuery = !term || [deal.title, deal.client.name, deal.description]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term));

      return matchesStatus && matchesQuery;
    });
  }, [deals, query, statusFilter]);

  const handleQuickStatus = (id: string, status: Deal["status"], paymentStatus: PaymentStatus) => {
    startTransition(async () => {
      const result = await updateDealStatus({ id, status, paymentStatus });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Статус сделки обновлен");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Все сделки</CardTitle>
        <CardDescription>Отслеживайте текущие проекты, статусы оплаты, документы и напоминания по каждому заказу.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию или клиенту" className="pl-10" />
          </div>
          <select className="h-11 rounded-2xl border bg-white px-4 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="all">Все статусы</option>
            <option value="draft">Черновик</option>
            <option value="sent">Отправлена</option>
            <option value="paid">Оплачена</option>
            <option value="completed">Завершена</option>
            <option value="cancelled">Отменена</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={FileText} title="Сделки пока не найдены" description="Добавьте первую сделку, чтобы отслеживать оплату, документы и сроки." />
        ) : (
          <div className="space-y-3">
            {filtered.map((deal) => {
              const status = statusMap[deal.status];

              return (
                <div key={deal.id} className="rounded-[24px] border p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/deals/${deal.id}`} className="font-semibold hover:text-primary">{deal.title}</Link>
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <Badge variant="outline">Оплата: {paymentStatusMap[deal.paymentStatus]}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{deal.client.name} - {formatCurrency(deal.amount.toString())} - срок {formatDate(deal.dueDate)}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Документы: {deal.documents.length} - напоминания: {deal.reminders.length}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleQuickStatus(deal.id, "sent", deal.paymentStatus)} disabled={isPending}>Отправить</Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickStatus(deal.id, "paid", "paid")} disabled={isPending}>Отметить оплату</Button>
                      <Button variant="outline" size="sm" onClick={() => handleQuickStatus(deal.id, "completed", "paid")} disabled={isPending}>Завершить</Button>
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