import { Bell, BriefcaseBusiness, FileText, Files, UserRound, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const items = [
  {
    title: "Профиль исполнителя",
    icon: UserRound,
    description:
      "Один раз заполняете основные данные и дальше используете их в сделках и документах без ручного дублирования.",
  },
  {
    title: "Клиенты и услуги",
    icon: BriefcaseBusiness,
    description:
      "Сохраняете постоянных клиентов и типовые услуги, чтобы новая сделка собиралась быстрее и понятнее.",
  },
  {
    title: "Сделки и суммы",
    icon: WalletCards,
    description:
      "Видите сумму, предоплату, статус работы и оплату по каждому заказу без переходов между разными таблицами.",
  },
  {
    title: "Договор и акт",
    icon: Files,
    description:
      "Документы собираются из данных сделки, поэтому не нужно каждый раз копировать реквизиты и условия вручную.",
  },
  {
    title: "Следующие шаги",
    icon: Bell,
    description:
      "Напоминания помогают не терять оплату, отправку акта и другие важные действия по конкретной сделке.",
  },
  {
    title: "Понятный рабочий результат",
    icon: FileText,
    description:
      "На выходе у вас не просто учётка, а собранный кабинет, где клиент, сделка и документы уже связаны между собой.",
  },
];

export function FullDescription() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Что внутри кабинета"
          title="Как выглядит рабочий результат, ради которого вы заходите в сервис"
          description="Одна и та же логика проходит через весь продукт: сначала клиент и сделка, затем документы, оплата и следующие действия."
          align="center"
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map(({ title, icon: Icon, description }) => (
            <Card
              key={title}
              className="h-full border-white/70 bg-white/90 p-6 shadow-[0_16px_48px_rgba(28,45,62,0.08)] backdrop-blur transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
