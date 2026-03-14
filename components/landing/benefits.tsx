import { FileStack, FolderKanban, MessageSquareText, NotebookText, ReceiptText, Sheet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const replacements = [
  {
    title: "Таблицы с клиентами и оплатами",
    description: "Вместо отдельных строк, которые быстро теряют контекст сделки, документов и следующего шага.",
    icon: Sheet,
  },
  {
    title: "Заметки и список задач",
    description: "Когда важные договорённости, суммы и дедлайны живут в голове или в случайных заметках.",
    icon: NotebookText,
  },
  {
    title: "Папки с договорами и актами",
    description: "Документы не нужно искать по файлам и версиям, потому что они привязаны к конкретной сделке.",
    icon: FileStack,
  },
  {
    title: "Переписки в мессенджерах",
    description: "Клиент общается в чате, но структура сделки, оплата и документы остаются в вашем кабинете.",
    icon: MessageSquareText,
  },
  {
    title: "Ручное создание договора",
    description: "Один раз вбили данные по сделке и дальше используете их для документов, а не собираете заново.",
    icon: ReceiptText,
  },
  {
    title: "Разрозненные карточки заказов",
    description: "Клиент, сумма, статус оплаты и документы остаются в одной логике, а не в нескольких сервисах.",
    icon: FolderKanban,
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Что заменяет сервис"
          title="Что можно собрать в одном кабинете вместо россыпи отдельных инструментов"
          description="SamoDoc сводит в одну рабочую систему то, что обычно разбросано по таблицам, заметкам, файлам и чатам."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {replacements.map(({ title, description, icon: Icon }) => (
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
