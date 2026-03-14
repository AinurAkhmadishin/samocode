import { Bell, BriefcaseBusiness, FileStack, Files, UserRound, WalletCards } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const items = [
  {
    title: "Профиль исполнителя",
    icon: UserRound,
    description:
      "Храните основные данные профиля, чтобы использовать их в документах и не заполнять одни и те же поля заново.",
  },
  {
    title: "Услуги",
    icon: BriefcaseBusiness,
    description:
      "Сохраняйте повторяющиеся услуги, стоимость, единицы работы и базовые условия для следующих сделок.",
  },
  {
    title: "Оплаты",
    icon: WalletCards,
    description:
      "Фиксируйте суммы, предоплату и текущий статус оплаты, чтобы видеть финансовую картину по заказам без лишней путаницы.",
  },
  {
    title: "Документы",
    icon: Files,
    description:
      "Собирайте договоры, акты и счета на основе данных сделки и профиля, чтобы быстрее оформлять типовые документы.",
  },
  {
    title: "Напоминания",
    icon: Bell,
    description:
      "Не теряйте следующие шаги по заказу: сервис помогает помнить про отправку акта, оплату и другие важные моменты.",
  },
  {
    title: "Фокус на реальной работе",
    icon: FileStack,
    description:
      "Вместо перегруженной CRM здесь только те сущности, которые действительно нужны исполнителю в ежедневной практике.",
  },
];

export function FullDescription() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Что внутри"
          title="Все ключевые рабочие сущности собраны в одном понятном кабинете"
          description="SamoDoc помогает выстроить простой поток работы: от клиента и услуги до сделки, оплаты, документов и напоминаний."
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
