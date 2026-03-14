import { ArrowDown, ArrowRight, FileSignature, LogIn, NotebookTabs, Wallet } from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";

const steps = [
  {
    number: "01",
    title: "Зарегистрируйтесь и войдите",
    description: "Создайте аккаунт по логину и паролю и сразу попадите в рабочий кабинет.",
    icon: LogIn,
  },
  {
    number: "02",
    title: "Добавьте клиента и шаблон услуги",
    description: "Сохраните клиента и подготовьте услугу, которую сможете использовать в следующих сделках.",
    icon: NotebookTabs,
  },
  {
    number: "03",
    title: "Создайте сделку и сформируйте документы",
    description: "Соберите договор, акт и сводку оплаты на основе данных по конкретному заказу.",
    icon: FileSignature,
  },
  {
    number: "04",
    title: "Контролируйте оплату и важные действия по заказу",
    description: "Следите за статусами и не забывайте о следующих шагах благодаря напоминаниям.",
    icon: Wallet,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-[40px] border border-white/70 bg-[#16384b] px-6 py-10 text-white shadow-[0_24px_80px_rgba(18,39,55,0.18)] sm:px-8 lg:px-12 lg:py-14">
        <SectionHeading
          eyebrow="Как это работает"
          title="Понятный сценарий в четыре шага"
          description="Без сложного внедрения и без длинного обучения. Сервис выстроен вокруг обычной логики работы самозанятого исполнителя."
          className="[&_h2]:text-white [&_p:first-child]:text-white/60 [&_p:last-child]:text-white/70"
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {steps.map(({ number, title, description, icon: Icon }, index) => (
            <div key={title} className="relative rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">{number}</span>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/70">{description}</p>
              {index < steps.length - 1 ? (
                <>
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-white/35 lg:block" />
                  <ArrowDown className="mx-auto mt-5 h-5 w-5 text-white/35 lg:hidden" />
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
