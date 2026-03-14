"use client";

import { useTransition } from "react";
import type { Client, DealStatus, PaymentStatus } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { dealSchema, type DealFormInput, type DealInput } from "@/lib/validations/deal";
import { saveDeal } from "@/server/actions/deals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ClientServiceTemplate } from "@/lib/serializers";

const defaultValues: DealFormInput = {
  clientId: "",
  serviceTemplateId: "",
  title: "",
  description: "",
  amount: 0,
  prepaymentAmount: null,
  status: "draft",
  paymentStatus: "unpaid",
  startDate: "",
  dueDate: "",
};

const dealStatusLabels: Record<DealStatus, string> = {
  draft: "Черновик",
  sent: "Отправлена",
  paid: "Оплачена",
  completed: "Завершена",
  cancelled: "Отменена",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Не оплачено",
  partial: "Частично оплачено",
  paid: "Оплачено",
};

type DealFormProps = {
  clients: Client[];
  templates: ClientServiceTemplate[];
  initialValues?: DealFormInput;
  hideHeader?: boolean;
};

export function DealForm({ clients, templates, initialValues, hideHeader = false }: DealFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<DealFormInput, undefined, DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveDeal(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(values.id ? "Сделка обновлена" : "Сделка создана");

      if (!values.id && result.dealId) {
        router.push(`/deals/${result.dealId}`);
      } else {
        router.refresh();
      }
    });
  });

  return (
    <Card>
      {!hideHeader ? (
        <CardHeader>
          <CardTitle>{initialValues?.id ? "Редактирование сделки" : "Новая сделка"}</CardTitle>
          <CardDescription>Выберите клиента, укажите стоимость и зафиксируйте условия работы.</CardDescription>
        </CardHeader>
      ) : null}
      <CardContent className={hideHeader ? "pt-6" : undefined}>
        <form className="space-y-5" onSubmit={onSubmit}>
          <input type="hidden" {...form.register("id")} />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Клиент" error={form.formState.errors.clientId?.message}>
              <select className="flex h-11 w-full rounded-2xl border bg-white px-4 text-sm" {...form.register("clientId")}>
                <option value="">Выберите клиента</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
              </select>
            </FormField>
            <FormField label="Шаблон услуги" error={form.formState.errors.serviceTemplateId?.message}>
              <select className="flex h-11 w-full rounded-2xl border bg-white px-4 text-sm" {...form.register("serviceTemplateId")}>
                <option value="">Без шаблона</option>
                {templates.map((template) => <option key={template.id} value={template.id}>{template.title}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Название сделки" error={form.formState.errors.title?.message}>
            <Input placeholder="Например, дизайн лендинга для клиента" {...form.register("title")} />
          </FormField>
          <FormField label="Описание" error={form.formState.errors.description?.message}>
            <Textarea placeholder="Что входит в работу и какие есть договорённости" {...form.register("description")} />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Сумма" error={form.formState.errors.amount?.message}>
              <Input type="number" step="0.01" {...form.register("amount", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Предоплата" error={form.formState.errors.prepaymentAmount?.message}>
              <Input type="number" step="0.01" {...form.register("prepaymentAmount", { setValueAs: (value) => value === "" ? null : Number(value) })} />
            </FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Статус сделки" error={form.formState.errors.status?.message}>
              <select className="flex h-11 w-full rounded-2xl border bg-white px-4 text-sm" {...form.register("status")}>
                {(["draft", "sent", "paid", "completed", "cancelled"] as DealStatus[]).map((status) => <option key={status} value={status}>{dealStatusLabels[status]}</option>)}
              </select>
            </FormField>
            <FormField label="Статус оплаты" error={form.formState.errors.paymentStatus?.message}>
              <select className="flex h-11 w-full rounded-2xl border bg-white px-4 text-sm" {...form.register("paymentStatus")}>
                {(["unpaid", "partial", "paid"] as PaymentStatus[]).map((status) => <option key={status} value={status}>{paymentStatusLabels[status]}</option>)}
              </select>
            </FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Дата начала" error={form.formState.errors.startDate?.message}>
              <Input type="date" {...form.register("startDate")} />
            </FormField>
            <FormField label="Срок" error={form.formState.errors.dueDate?.message}>
              <Input type="date" {...form.register("dueDate")} />
            </FormField>
          </div>
          <Button type="submit" disabled={isPending}>{isPending ? "Сохраняем..." : initialValues?.id ? "Сохранить сделку" : "Создать сделку"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
