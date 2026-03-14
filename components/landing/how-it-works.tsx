import { CalendarClock, CheckCircle2, FileSignature, MessageSquare, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const steps = [
  {
    title: "Клиент написал в мессенджере",
    description: "Вы не начинаете с чистого листа в документах, а заводите клиента и сразу фиксируете договорённость в сделке.",
    icon: MessageSquare,
  },
  {
    title: "Сделка собирается в одном месте",
    description: "Название услуги, сумма, сроки и статус оплаты живут в карточке сделки, а не в нескольких файлах сразу.",
    icon: CalendarClock,
  },
  {
    title: "Договор и акт формируются из данных сделки",
    description: "Вы не копируете реквизиты и условия заново: документы опираются на уже заполненную карточку.",
    icon: FileSignature,
  },
  {
    title: "Дальше видно, что делать",
    description: "Остаётся контролировать оплату, отправить акт и закрыть заказ без ощущения, что что-то потерялось.",
    icon: Wallet,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl rounded-[40px] border border-white/70 bg-[#16384b] px-6 py-10 text-white shadow-[0_24px_80px_rgba(18,39,55,0.18)] sm:px-8 lg:px-12 lg:py-14">
        <SectionHeading
          eyebrow="Реальный сценарий"
          title="Как это выглядит в обычной работе с клиентом"
          description="Простой пример: клиент написал, вы согласовали работу, оформили документы и дальше уже не теряете оплату и следующие шаги."
          className="[&_h2]:text-white [&_p:first-child]:text-white/60 [&_p:last-child]:text-white/70"
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-white/10 p-6 text-white backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/60">Мини-сценарий</p>
            <h3 className="mt-4 text-2xl font-semibold">&quot;Нужно быстро оформить проект и не потерять закрывающие документы&quot;</h3>
            <div className="mt-6 space-y-4 text-sm leading-7 text-white/75">
              <p>Исполнитель добавляет клиента, фиксирует стоимость и сроки в сделке, а затем сразу формирует договор.</p>
              <p>Когда работа сдана, из этой же сделки оформляется акт, а статус оплаты и следующий шаг остаются в одном месте.</p>
              <p>В итоге не нужно вспоминать, где лежит шаблон, кому уже отправили документы и по какому заказу ждёте оплату.</p>
            </div>
            <div className="mt-6 flex items-center gap-3 rounded-[22px] border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-50">
              <CheckCircle2 className="h-4 w-4" />
              Один кабинет вместо хаоса из чатов, файлов и ручной сборки документов
            </div>
          </Card>

          <div className="grid gap-4">
            {steps.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
