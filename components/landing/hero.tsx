import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AuthButtons } from "@/components/auth/auth-buttons";
import { HeroMockup } from "@/components/landing/hero-mockup";
import { Badge } from "@/components/ui/badge";

const quickBenefits = [
  "Клиенты, сделки и документы в одном кабинете",
  "Договор и акт без хаоса в файлах и чатах",
  "Понятный первый результат уже в первые 10 минут",
  "Быстрый старт без долгой настройки",
];

export function Hero() {
  return (
    <section className="px-4 pb-12 pt-10 sm:px-6 sm:pb-16 lg:px-8 lg:pb-24 lg:pt-14">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div className="max-w-2xl">
          <Badge className="rounded-full bg-white/75 px-4 py-1.5 text-primary shadow-sm">
            Для самозанятых исполнителей и фрилансеров
          </Badge>
          <h1 className="mt-6 text-4xl text-balance font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Клиенты, сделки и документы в одном кабинете, чтобы получить первый результат уже за 10 минут
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            SamoDoc помогает быстро собрать рабочий процесс: добавить клиента, открыть сделку, оформить договор и акт
            без хаоса в таблицах, заметках и переписках.
          </p>

          <div className="mt-8">
            <AuthButtons />
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-600">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Зайти, заполнить профиль и собрать первый рабочий кейс можно за один короткий заход
            <ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" />
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            {quickBenefits.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-4 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <HeroMockup />
      </div>
    </section>
  );
}
