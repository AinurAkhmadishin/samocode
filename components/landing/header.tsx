"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { landingNavLinks } from "@/components/landing/nav-links";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16384b] text-sm font-bold text-white shadow-sm">
            S
          </span>
          <div>
            <p className="text-base font-semibold text-slate-950">SamoDoc</p>
            <p className="text-xs text-muted-foreground">Рабочий кабинет самозанятого</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {landingNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-slate-700 hover:text-slate-950">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <AuthButtons className="sm:flex-row" />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/70 bg-background/95 transition-[max-height,opacity] duration-300 lg:hidden",
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <nav className="flex flex-col gap-2">
            {landingNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-800 transition-colors hover:bg-secondary/70"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 border-t border-border/70 pt-4">
            <AuthButtons orientation="vertical" fullWidth className="w-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
