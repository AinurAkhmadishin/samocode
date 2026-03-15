import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const faqItems = [
  {
    question: "Для кого подходит SamoDoc?",
    answer:
      "Для самозанятых исполнителей и фрилансеров, которые работают с клиентами самостоятельно и хотят держать сделки, услуги и документы в одном месте.",
  },
  {
    question: "Это бухгалтерия?",
    answer:
      "Нет. SamoDoc не заменяет бухгалтерские и налоговые сервисы. Он помогает организовать рабочий процесс вокруг клиента и сделки.",
  },
  {
    question: "Это заменяет «Мой налог»?",
    answer:
      "Нет. SamoDoc не заменяет «Мой налог», а помогает навести порядок в клиентах, сделках, документах и следующих шагах по заказам.",
  },
  {
    question: "Какие документы можно формировать?",
    answer: "В базовой версии можно формировать договор, акт и счёт по сделке.",
  },
  {
    question: "Нужна ли сложная настройка?",
    answer:
      "Нет. Достаточно зарегистрироваться, заполнить профиль и добавить первого клиента или услугу.",
  },
  {
    question: "Можно ли пользоваться сервисом одному?",
    answer:
      "Да. SamoDoc изначально рассчитан на самостоятельную работу без команды и перегруженных CRM-сценариев.",
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
