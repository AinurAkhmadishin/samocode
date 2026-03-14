import { CheckCircle2, Clock3, FileText, FolderKanban } from "lucide-react";
import { SectionHeading } from "@/components/landing/section-heading";
import { Card } from "@/components/ui/card";

const firstResults = [
  {
    title: "Заполните профиль исполнителя",
    description: "Чтобы ваши данные сразу подставлялись в договоры и акты без ручного копирования.",
    icon: CheckCircle2,
  },
  {
    title: "Добавьте первого клиента и сделку",
    description: "У вас появится единая карточка работы вместо заметок, чатов и разбросанных файлов.",
    icon: FolderKanban,
  },
  {
    title: "Сформируйте договор и акт",
    description: "Документы собираются на основе сделки, а не вручную каждый раз с нуля.",
    icon: FileText,
  },
];

export function AboutService() {
  return (
    <section id="features" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <Card className="overflow-hidden border-white/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(248,244,237,0.92))] p-8 shadow-[0_18px_60px_rgba(28,45,62,0.08)] sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <SectionHeading
              eyebrow="Первые 10 минут"
              title="Что вы получите почти сразу после входа"
              description="Не абстрактный аккаунт, а первый собранный рабочий процесс: клиент, сделка и документы в одном кабинете."
            />

            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-[24px] border border-[#eadcc4] bg-[#fff7ea] px-5 py-4 text-sm font-medium text-slate-700">
                <Clock3 className="h-4 w-4 text-primary" />
                Через 10 минут у вас уже есть понятная точка старта, а не пустой кабинет.
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {firstResults.map(({ title, description, icon: Icon }) => (
                  <div key={title} className="rounded-[26px] border border-slate-200 bg-white p-5">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
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
