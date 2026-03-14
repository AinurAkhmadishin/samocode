"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { serviceTemplateSchema, type ServiceTemplateFormInput, type ServiceTemplateInput } from "@/lib/validations/service-template";
import { saveServiceTemplate } from "@/server/actions/service-templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const defaultValues: ServiceTemplateFormInput = {
  title: "",
  description: "",
  price: 0,
  prepaymentPercent: null,
  deadlineDays: null,
  unit: "",
};

type ServiceTemplateFormProps = {
  initialValues?: ServiceTemplateFormInput;
  onReset?: () => void;
};

export function ServiceTemplateForm({ initialValues, onReset }: ServiceTemplateFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ServiceTemplateFormInput, undefined, ServiceTemplateInput>({
    resolver: zodResolver(serviceTemplateSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveServiceTemplate(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(values.id ? "Услуга обновлена" : "Услуга создана");
      form.reset(defaultValues);
      onReset?.();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValues?.id ? "Редактирование услуги" : "Новая услуга"}</CardTitle>
        <CardDescription>Сохраните шаблон, чтобы быстрее создавать сделки и повторяющиеся документы.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <input type="hidden" {...form.register("id")} />
          <FormField label="Название услуги" error={form.formState.errors.title?.message}>
            <Input placeholder="Например, разработка сайта" {...form.register("title")} />
          </FormField>
          <FormField label="Описание" error={form.formState.errors.description?.message}>
            <Textarea placeholder="Кратко опишите состав услуги и условия работы" {...form.register("description")} />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Цена" error={form.formState.errors.price?.message}>
              <Input type="number" step="0.01" {...form.register("price", { valueAsNumber: true })} />
            </FormField>
            <FormField label="Единица" error={form.formState.errors.unit?.message}>
              <Input placeholder="проект / час / месяц" {...form.register("unit")} />
            </FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Предоплата, %" error={form.formState.errors.prepaymentPercent?.message}>
              <Input type="number" {...form.register("prepaymentPercent", { setValueAs: (value) => value === "" ? null : Number(value) })} />
            </FormField>
            <FormField label="Срок, дней" error={form.formState.errors.deadlineDays?.message}>
              <Input type="number" {...form.register("deadlineDays", { setValueAs: (value) => value === "" ? null : Number(value) })} />
            </FormField>
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>{isPending ? "Сохраняем..." : initialValues?.id ? "Сохранить" : "Создать услугу"}</Button>
            {initialValues?.id ? <Button type="button" variant="outline" onClick={() => { form.reset(defaultValues); onReset?.(); }}>Отмена</Button> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
