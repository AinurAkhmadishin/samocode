import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const faqItems = [
  {
    question: "Для кого подходит сервис?",
    answer:
      "Для самозанятых исполнителей и фрилансеров, которым важно держать клиентов, сделки, договоры, акты и оплату в одном кабинете.",
  },
  {
    question: "Нужна ли сложная настройка перед стартом?",
    answer:
      "Нет. Достаточно зарегистрироваться, заполнить профиль и можно сразу добавить клиента, создать сделку и оформить первые документы.",
  },
  {
    question: "Можно ли использовать сервис без OAuth и соцсетей?",
    answer:
      "Да. В проекте используется обычная регистрация по логину и паролю, без внешних провайдеров входа.",
  },
  {
    question: "Что можно хранить внутри кабинета?",
    answer:
      "Профиль исполнителя, клиентов, услуги, сделки, суммы, статусы оплаты, документы и напоминания по следующим действиям.",
  },
  {
    question: "Подходит ли это для локальной разработки?",
    answer:
      "Да. После seed доступна тестовая учётная запись `admin/admin`, которая предназначена только для dev и local testing.",
  },
  {
    question: "Заменяет ли сервис Мой налог или бухгалтерию?",
    answer:
      "Нет. SamoDoc помогает собрать ежедневную работу по клиентам и документам, но не заменяет государственные сервисы и бухгалтерские решения.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Частые вопросы"
          description="Коротко о том, как устроен сервис и чего от него стоит ожидать."
          align="center"
        />

        <div className="mt-10 space-y-4">
          {faqItems.map((item) => (
            <Card key={item.question} className="border-white/70 bg-white/90 p-0">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="text-base font-semibold text-slate-950">{item.question}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="border-t border-slate-100 px-6 py-5 text-sm leading-7 text-slate-600">{item.answer}</div>
              </details>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
