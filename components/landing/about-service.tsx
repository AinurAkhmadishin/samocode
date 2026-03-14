import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

export function AboutService() {
  return (
    <section id="features" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Card className="overflow-hidden border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(248,244,237,0.92))] p-8 shadow-[0_18px_60px_rgba(28,45,62,0.08)] sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <SectionHeading
              eyebrow="Что это за сервис"
              title="Лёгкий рабочий кабинет для тех, кто ведёт клиентов самостоятельно"
              description="SamoDoc помогает собрать повторяющиеся задачи в одном месте: клиентов, услуги, сделки, документы и напоминания. Это не тяжёлая CRM, а понятный рабочий инструмент для самозанятого исполнителя."
            />

            <div className="grid gap-4 text-sm leading-7 text-slate-600 sm:grid-cols-2">
              <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                Интерфейс собран вокруг повседневной практики: быстро добавить клиента, создать сделку, зафиксировать оплату и перейти к документам без лишних сущностей и сложных сценариев.
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-white p-5">
                SamoDoc полезен, когда важно держать рабочий процесс под рукой: видеть активные заказы, не забывать про акты, дедлайны и следующие шаги по каждому проекту.
              </div>
              <div className="rounded-[26px] border border-slate-200 bg-white p-5 sm:col-span-2">
                Это не бухгалтерия и не замена государственным сервисам. Это спокойный кабинет для ежедневной работы, который помогает меньше держать в голове и быстрее оформлять типовые действия.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
