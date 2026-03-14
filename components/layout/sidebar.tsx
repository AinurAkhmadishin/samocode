"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, HandCoins, LayoutDashboard, Settings, Users } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types";

const navigation = [
  { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/clients", label: "Клиенты", icon: Users },
  { href: "/services", label: "Услуги", icon: BriefcaseBusiness },
  { href: "/deals", label: "Сделки", icon: HandCoins },
  { href: "/settings", label: "Настройки профиля", icon: Settings },
];

export function Sidebar({ user }: { user: AppUser }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen flex-col justify-between border-r border-border/70 bg-[#f8f2e8]/80 px-5 py-6 backdrop-blur lg:flex">
      <div>
        <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
              {(user.name ?? user.email ?? "S").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name ?? "Исполнитель"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email ?? "Локальный аккаунт"}</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-secondary px-4 py-3 text-sm leading-6 text-secondary-foreground">
            Договоры, акты, счета и напоминания собраны в одном рабочем кабинете.
          </div>
        </div>

        <nav className="mt-6 space-y-1">
          {navigation.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground",
                  active && "bg-card text-foreground shadow-sm",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3">
        <LogoutButton className="w-full justify-start rounded-2xl px-4" />
      </div>
    </aside>
  );
}