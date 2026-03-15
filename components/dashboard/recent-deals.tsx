import Link from "next/link";
import type { Client, Deal } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        <CardDescription>Последние обновления по заказам и документам.</CardDescription>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <div className="rounded-[24px] border border-dashed bg-card/70 p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <ArrowUpRight className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Пока нет ни одной сделки</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Создайте первую сделку, чтобы видеть здесь статусы, документы и последние обновления.
            </p>
            <div className="mt-5">
              <Link
                href="/deals/new"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
              >
                Создать сделку
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => {
              const status = statusMap[deal.status];

              return (
                <Link
                  key={deal.id}
                  href={`/deals/${deal.id}`}
                  className="group block cursor-pointer rounded-[24px] border px-4 py-4 transition duration-200 hover:border-primary/45 hover:bg-secondary/35 hover:shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{deal.title}</p>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-muted-foreground">Сумма</p>
                        <p className="mt-1 font-semibold">{formatCurrency(deal.amount.toString())}</p>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                        <p>
                          <span className="text-foreground">Клиент:</span> {deal.client.name}
                        </p>
                        <p>
                          <span className="text-foreground">Обновлено:</span> {formatDate(deal.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 sm:block sm:text-right">
                      <div className="rounded-full border border-transparent p-1.5 text-muted-foreground transition group-hover:border-primary/15 group-hover:bg-background group-hover:text-foreground">
                        <ArrowUpRight className="h-4 w-4" />
                      </div>
                    </div>
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
