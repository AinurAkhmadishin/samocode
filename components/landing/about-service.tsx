import { CheckCircle2, Clock3, FileText, FolderKanban, UserRound } from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";
import { Card } from "@/components/ui/card";

const firstResults = [
  {
    title: "Заполните профиль исполнителя",
    description: "Добавьте базовые данные, чтобы сервис мог подставлять их в рабочие сущности и документы.",
    icon: UserRound,
  },
  {
    title: "Добавьте первую услугу",
    description: "Сохраните типовую услугу, чтобы не вводить одинаковые данные вручную для каждого заказа.",
    icon: CheckCircle2,
  },
  {
    title: "Создайте первую сделку",
    description: "Оформите заказ как отдельную сделку с суммой, статусом и следующим шагом.",
    icon: FolderKanban,
  },
  {
    title: "Сформируйте базовые документы",
    description: "Подготовьте договор, акт или счёт на основе данных клиента и сделки.",
    icon: FileText,
  },
];

export function AboutService() {
  return (
    <section id="features" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-18">
      <div className="mx-auto max-w-7xl">
        <Card className="overflow-hidden border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(248,244,237,0.92))] p-8 shadow-[0_18px_60px_rgba(28,45,62,0.08)] sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <SectionHeading
              eyebrow="Первые 10 минут"
              title="Что вы получите в первые 10 минут"
              description="Без сложной настройки, длинного онбординга и тяжёлых CRM-сценариев."
            />

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-[24px] border border-[#eadcc4] bg-[#fff7ea] px-5 py-4 text-sm font-medium text-slate-700">
                <Clock3 className="h-4 w-4 shrink-0 text-primary" />
                Вход в сервис быстро превращается в понятный рабочий старт: профиль, услуга, сделка и документы.
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {firstResults.map(({ title, description, icon: Icon }) => (
                  <div key={title} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold leading-6 text-slate-950">{title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
