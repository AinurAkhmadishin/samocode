import type { ReactNode } from "react";
import type { AppUser } from "@/types";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";

type AppShellProps = {
  user: AppUser;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppShell({ user, title, description, actions, children }: AppShellProps) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <Sidebar user={user} />
      <div className="flex min-h-screen flex-col">
        <MobileNav user={user} />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pb-10">
          <div className="flex flex-col gap-4 rounded-[28px] border bg-card/90 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                SamoDoc
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

