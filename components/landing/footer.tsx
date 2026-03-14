import Link from "next/link";
import { landingNavLinks } from "@/components/landing/nav-links";

export function Footer() {
  return (
    <footer className="border-t border-white/70 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-md">
          <p className="text-lg font-semibold text-slate-950">SamoDoc</p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Лёгкий рабочий кабинет для самозанятых исполнителей: клиенты, сделки, документы, оплаты и напоминания в
            одном спокойном интерфейсе.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          {landingNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-950">
              {link.label}
            </Link>
          ))}
          <Link href="#top" className="hover:text-slate-950">
            Наверх
          </Link>
          <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
            Войти
          </Link>
        </div>
      </div>
    </footer>
  );
}
