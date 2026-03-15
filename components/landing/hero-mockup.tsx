import { Bell, CheckCircle2, CircleDollarSign, FileText, FolderKanban, Sparkles, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const deals = [
  { name: "Лендинг для студии", stage: "На согласовании", payment: "Предоплата 30 000 ₽" },
  { name: "SMM-поддержка проекта", stage: "В работе", payment: "Следующий шаг: отправить акт" },
  { name: "Копирайтинг для сайта", stage: "Ждёт акта", payment: "Финальный расчёт 18 000 ₽" },
];

export function HeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="absolute -left-6 top-12 hidden h-24 w-24 rounded-full bg-[#e4c79d]/40 blur-2xl lg:block" />
      <div className="absolute -right-8 bottom-10 hidden h-28 w-28 rounded-full bg-[#a9c2d5]/40 blur-2xl lg:block" />
      <Card className="relative overflow-hidden border-white/70 bg-white/90 p-4 shadow-[0_24px_80px_rgba(28,45,62,0.12)] backdrop-blur">
        <div className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between rounded-[22px] bg-[#16384b] px-4 py-3 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/60">Рабочий кабинет</p>
              <p className="mt-1 text-lg font-semibold">Сделки и документы</p>
            </div>
            <Badge className="bg-white/10 text-white">Онлайн</Badge>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <FolderKanban className="h-4 w-4 text-primary" />
                  Активные сделки
                </div>
                <div className="mt-4 rounded-[22px] bg-[#16384b] px-4 py-4 text-white shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-white/60">Главная сделка</p>
                      <p className="mt-1 text-base font-semibold">Лендинг для студии</p>
                    </div>
                    <Badge className="bg-white/12 text-white">На согласовании</Badge>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-white/60">Сумма</p>
                      <p className="mt-1 text-2xl font-semibold">48 000 ₽</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-white/60">Следующий шаг</p>
                      <p className="mt-1 text-sm font-medium text-white/90">Отправить договор клиенту</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-3">
                  {deals.map((deal) => (
                    <div key={deal.name} className="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{deal.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{deal.payment}</p>
                        </div>
                        <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                          {deal.stage}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FileText className="h-4 w-4 text-primary" />
                    Документы
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                      <span>Договор</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                      <span>Акт</span>
                      <span className="text-xs font-semibold text-slate-500">Черновик</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
                      <span>Счёт</span>
                      <span className="text-xs font-semibold text-slate-500">Готов</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <CircleDollarSign className="h-4 w-4 text-primary" />
                    Оплаты
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-emerald-50 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">Получено</p>
                      <p className="mt-1 text-xl font-semibold text-emerald-900">30 000 ₽</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 px-3 py-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">Ожидается</p>
                      <p className="mt-1 text-xl font-semibold text-amber-900">18 000 ₽</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Users2 className="h-4 w-4 text-primary" />
                  Карточка клиента
                </div>
                <div className="mt-4 rounded-[22px] bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">Анна Смирнова</p>
                      <p className="mt-1 text-sm text-slate-500">Маркетолог, 2 активные задачи</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      1 шаг сейчас
                    </span>
                  </div>
                  <div className="mt-4 grid gap-2 text-sm text-slate-600">
                    <div className="rounded-2xl bg-white px-3 py-2">Контактные данные</div>
                    <div className="rounded-2xl bg-white px-3 py-2">Статус оплаты: частично</div>
                    <div className="rounded-2xl bg-[#fff7ea] px-3 py-2 font-medium text-slate-800">Следующий документ: акт</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Bell className="h-4 w-4 text-primary" />
                  Напоминания
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div className="rounded-2xl bg-rose-50 px-3 py-3 text-rose-900">Сегодня: отправить акт клиенту</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3">18 марта: проверить оплату по счёту</div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3">22 марта: напомнить клиенту про согласование</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
