import Link from "next/link";
import type { Client, Deal } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "warning" | "success" | "danger" }> = {
  draft: { label: "Черновик", variant: "default" },
  sent: { label: "Отправлена", variant: "warning" },
  paid: { label: "Оплачена", variant: "success" },
  completed: { label: "Завершена", variant: "success" },
  cancelled: { label: "Отменена", variant: "danger" },
};

export function RecentDeals({ deals }: { deals: Array<Deal & { client: Client }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Последние сделки</CardTitle>
        <CardDescription>Пять последних обновлений по заказам и документам.</CardDescription>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <EmptyState
            icon={ArrowUpRight}
            title="Пока нет сделок"
            description="Создайте первую сделку, чтобы видеть здесь оплату, статусы и последние изменения."
          />
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => {
              const status = statusMap[deal.status];

              return (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="flex flex-col gap-3 rounded-[24px] border px-4 py-4 transition hover:border-primary/40 hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{deal.title}</p>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {deal.client.name} · Обновлено {formatDate(deal.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right">
                    <div>
                      <p className="text-sm text-muted-foreground">Сумма</p>
                      <p className="font-semibold">{formatCurrency(deal.amount.toString())}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
