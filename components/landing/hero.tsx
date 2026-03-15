import { ArrowRight, CheckCircle2, CircleDot, FileText, FolderKanban, LayoutPanelTop } from "lucide-react";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { HeroMockup } from "@/components/landing/hero-mockup";
import { Badge } from "@/components/ui/badge";

const quickBenefits = [
  {
    title: "Клиенты и сделки в одном месте",
    icon: FolderKanban,
  },
  {
    title: "Договор и акт за несколько минут",
    icon: FileText,
  },
  {
    title: "Порядок в работе без таблиц и заметок",
    icon: CircleDot,
  },
  {
    title: "Понятный рабочий кабинет без перегруженности",
    icon: LayoutPanelTop,
  },
];

export function Hero() {
  return (
    <section className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-8 lg:pb-18 lg:pt-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-12">
        <div className="max-w-2xl">
          <Badge className="rounded-full bg-white/75 px-4 py-1.5 text-primary shadow-sm">
            Для самозанятых исполнителей и фрилансеров
          </Badge>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-slate-950 text-balance sm:text-[3.35rem] lg:text-[3.8rem]">
            Клиенты, сделки и документы в одном кабинете — первый результат уже за 10 минут
          </h1>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-8 text-slate-700 sm:text-[1.12rem]">
            Добавьте клиента, оформите сделку и соберите базовые документы без таблиц, заметок и ручного хаоса.
          </p>

          <div className="mt-7">
            <AuthButtons />
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[22px] border border-white/70 bg-white/72 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Заполните профиль, добавьте первую услугу и соберите рабочую сделку за один короткий заход.</span>
            <ArrowRight className="hidden h-4 w-4 shrink-0 text-slate-400 sm:block" />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickBenefits.map(({ title, icon: Icon }) => (
              <div
                key={title}
                className="flex items-start gap-3 rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="leading-6">{title}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}
