import { LockKeyhole, ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const trustItems = [
  {
    title: "Понятная авторизация",
    description: "Классический вход по логину и паролю делает доступ к кабинету предсказуемым и простым для локальной разработки.",
    icon: LockKeyhole,
  },
  {
    title: "Без сложного внедрения",
    description: "Сервис можно использовать как практический рабочий инструмент, а не как отдельный проект по настройке.",
    icon: Sparkles,
  },
  {
    title: "Не нужно изучать тяжёлую CRM",
    description:
      "Логика интерфейса строится вокруг повседневных действий самостоятельного исполнителя, а не вокруг громоздких корпоративных процессов.",
    icon: SlidersHorizontal,
  },
  {
    title: "Подходит для ежедневной практики",
    description:
      "Он нужен не для отчётности ради отчётности, а для нормальной работы с клиентами, документами и оплатой изо дня в день.",
    icon: ShieldCheck,
  },
];

export function TrustBlock() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-[40px] border border-[#dfe5ea] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(237,242,246,0.92))] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <SectionHeading
          eyebrow="Доверие"
          title="Спокойный сервис без лишних обещаний и фальшивого блеска"
          description="SamoDoc не пытается казаться бухгалтерией, не заменяет «Мой налог» и не требует внедрения как тяжёлая CRM. Это рабочий кабинет для практических задач, которые действительно повторяются у самозанятого исполнителя."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {trustItems.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="h-full border-white/70 bg-white/80 p-6">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
