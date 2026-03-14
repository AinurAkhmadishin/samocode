import { Gauge, LayoutPanelTop, ListChecks, Rocket, UserCircle2, Workflow } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const benefits = [
  {
    title: "Быстрый старт без сложной настройки",
    description: "Обычная регистрация по логину и паролю помогает начать работу сразу, без внешних провайдеров и лишних шагов.",
    icon: Rocket,
  },
  {
    title: "Понятный интерфейс без перегруженности",
    description: "Только ключевые действия, которые нужны для ежедневной работы с клиентами и заказами.",
    icon: LayoutPanelTop,
  },
  {
    title: "Один кабинет вместо заметок, таблиц и файлов",
    description: "Клиенты, шаблоны, документы и напоминания больше не разбросаны по разным инструментам.",
    icon: ListChecks,
  },
  {
    title: "Быстрое оформление типовых сделок",
    description: "Повторяющиеся услуги и документы можно собирать заметно быстрее и спокойнее.",
    icon: Workflow,
  },
  {
    title: "Удобно для работы в одиночку",
    description: "Сервис подходит тем, кто сам ведёт общение, оформляет документы и контролирует оплату.",
    icon: UserCircle2,
  },
  {
    title: "Напоминания по важным этапам сделки",
    description: "Легче не пропускать оплату, согласование, отправку акта и другие ключевые точки.",
    icon: Gauge,
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Преимущества"
          title="Почему таким сервисом удобно пользоваться каждый день"
          description="SamoDoc не пытается заменить всё сразу. Он закрывает именно те задачи, которые регулярно повторяются у самозанятого исполнителя и часто создают лишний шум."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="border-white/70 bg-white/90 p-6">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff5f8] text-primary">
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
