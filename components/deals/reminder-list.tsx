"use client";

import type { Reminder } from "@prisma/client";
import { BellRing, Check, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteReminder, toggleReminder } from "@/server/actions/reminders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

const reminderLabels: Record<Reminder["type"], string> = {
  payment_followup: "Напомнить об оплате",
  issue_receipt: "Пробить чек",
  close_act: "Закрыть акт",
};

export function ReminderList({ reminders }: { reminders: Reminder[] }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (id: string, done: boolean) => {
    startTransition(async () => {
      const result = await toggleReminder({ id, done });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(done ? "Напоминание отмечено выполненным" : "Напоминание возвращено в работу");
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteReminder({ id });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Напоминание удалено");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Напоминания</CardTitle>
        <CardDescription>Следите за следующими действиями, чтобы не терять важные этапы сделки.</CardDescription>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <EmptyState icon={BellRing} title="Напоминаний пока нет" description="Добавьте напоминание, чтобы не забыть про оплату, чек или акт." />
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between rounded-[20px] border p-4">
                <div>
                  <p className="font-medium">{reminderLabels[reminder.type]}</p>
                  <p className="mt-1 text-sm text-muted-foreground">На дату {formatDate(reminder.scheduledFor)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant={reminder.done ? "secondary" : "outline"} size="icon" disabled={isPending} onClick={() => handleToggle(reminder.id, !reminder.done)}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" disabled={isPending} onClick={() => handleDelete(reminder.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
