"use client";

import { useTransition } from "react";
import { ReminderType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { reminderSchema, type ReminderInput } from "@/lib/validations/reminder";
import { saveReminder } from "@/server/actions/reminders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function ReminderForm({ dealId }: { dealId: string }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ReminderInput>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      dealId,
      type: ReminderType.issue_receipt,
      scheduledFor: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveReminder(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Напоминание сохранено");
      form.reset({ dealId, type: ReminderType.issue_receipt, scheduledFor: "" });
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Новое напоминание</CardTitle>
        <CardDescription>Добавьте следующее действие по сделке, чтобы ничего не забыть.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <input type="hidden" {...form.register("dealId")} />
          <FormField label="Тип" error={form.formState.errors.type?.message}>
            <select className="flex h-11 w-full rounded-2xl border bg-white px-4 text-sm" {...form.register("type")}>
              <option value={ReminderType.payment_followup}>Напомнить об оплате</option>
              <option value={ReminderType.issue_receipt}>Пробить чек</option>
              <option value={ReminderType.close_act}>Закрыть акт</option>
            </select>
          </FormField>
          <FormField label="Дата" error={form.formState.errors.scheduledFor?.message}>
            <Input type="date" {...form.register("scheduledFor")} />
          </FormField>
          <Button type="submit" disabled={isPending}>{isPending ? "Сохраняем..." : "Создать напоминание"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
