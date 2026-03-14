"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, HandCoins, LayoutDashboard, Settings, Users } from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";
import type { AppUser } from "@/types";

const items = [
  { href: "/dashboard", label: "Обзор", icon: LayoutDashboard },
  { href: "/clients", label: "Клиенты", icon: Users },
  { href: "/services", label: "Услуги", icon: BriefcaseBusiness },
  { href: "/deals", label: "Сделки", icon: HandCoins },
  { href: "/settings", label: "Профиль", icon: Settings },
];

export function MobileNav({ user }: { user: AppUser }) {
  const pathname = usePathname();

  return (
    <>
      <header className="border-b border-border/70 bg-background/90 px-4 py-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              SamoDoc
            </p>
            <p className="mt-1 text-sm font-semibold">{user.name ?? "Личный кабинет"}</p>
          </div>
          <LogoutButton variant="outline" className="rounded-full px-3 py-2 text-xs" />
        </div>
      </header>
      <nav className="fixed inset-x-4 bottom-4 z-40 rounded-[26px] border bg-card/95 p-2 shadow-lg backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-3 text-[11px] font-medium text-muted-foreground",
                  active && "bg-secondary text-secondary-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
