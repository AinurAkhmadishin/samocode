import { BellDot, CircleDollarSign, FolderKanban, WalletCards } from "lucide-react";
import type { DashboardStats as DashboardStatsType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const items = [
  {
    key: "activeDeals",
    label: "Активные сделки",
    icon: FolderKanban,
  },
  {
    key: "unpaidDeals",
    label: "Ожидают оплаты",
    icon: WalletCards,
  },
  {
    key: "monthRevenue",
    label: "Оплачено за месяц",
    icon: CircleDollarSign,
  },
  {
    key: "upcomingReminders",
    label: "Напоминания",
    icon: BellDot,
  },
] as const;

export function DashboardStats({ stats }: { stats: DashboardStatsType }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const value =
          item.key === "monthRevenue"
            ? formatCurrency(stats.monthRevenue)
            : stats[item.key].toLocaleString("ru-RU");

        return (
          <Card key={item.key} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold">{value}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary">
                <Icon className="h-5 w-5 text-secondary-foreground" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
