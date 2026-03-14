import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/landing/section-heading";

const audiences = [
  "Дизайнеры",
  "SMM-специалисты",
  "Копирайтеры",
  "Маркетологи",
  "Разработчики",
  "Фотографы",
  "Продюсеры услуг",
  "Консультанты",
];

const painPoints = [
  "Клиенты, заметки и документы разбросаны по разным местам",
  "Нужно быстро собирать повторяющиеся сделки и условия",
  "Оплаты и статусы легко потерять из виду",
  "Напоминания по актам и дедлайнам постоянно выпадают",
  "Хочется вести работу в одном спокойном интерфейсе",
];

export function ForWhom() {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Card className="border-white/70 bg-white/90 p-8">
          <SectionHeading
            eyebrow="Для кого подходит"
            title="Для специалистов, которые сами ведут клиентов и не хотят тратить время на громоздкие системы"
            description="Сервис особенно удобен тем, кто работает самостоятельно, регулярно оформляет похожие сделки и хочет держать клиентов, документы и оплаты в одном месте."
          />
        </Card>

        <div className="grid gap-6">
          <Card className="border-white/70 bg-white/90 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">Подходит ролям</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {audiences.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="rounded-full border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="border-white/70 bg-white/90 p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/70">Какие задачи закрывает</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {painPoints.map((item) => (
                <div key={item} className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
