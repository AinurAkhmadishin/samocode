"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import { serviceTemplateSchema, type ServiceTemplateFormInput, type ServiceTemplateInput } from "@/lib/validations/service-template";
import { saveServiceTemplate } from "@/server/actions/service-templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const defaultValues: ServiceTemplateFormInput = {
  title: "",
  description: "",
  price: "",
  prepaymentPercent: "",
  deadlineDays: "",
  unit: "",
};

type ServiceTemplateFormProps = {
  initialValues?: ServiceTemplateFormInput;
  onReset?: () => void;
};

export function ServiceTemplateForm({ initialValues, onReset }: ServiceTemplateFormProps) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ServiceTemplateFormInput, undefined, ServiceTemplateInput>({
    resolver: zodResolver(serviceTemplateSchema) as Resolver<ServiceTemplateFormInput, undefined, ServiceTemplateInput>,
    defaultValues: initialValues ?? defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const onSubmit = form.handleSubmit(
    (values) => {
      startTransition(async () => {
        const result = await saveServiceTemplate(values);

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success(values.id ? "Шаблон услуги обновлён" : "Услуга создана");
        form.reset(defaultValues);
        onReset?.();
      });
    },
    (errors) => {
      const firstError = Object.values(errors)[0];
      toast.error(firstError?.message ?? "Проверьте форму");
    },
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValues?.id ? "Редактирование услуги" : "Новая услуга"}</CardTitle>
        <CardDescription>Сохраните шаблон, чтобы быстрее создавать сделки и повторяющиеся документы.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <input type="hidden" {...form.register("id")} />

          <FormField label="Название услуги" error={form.formState.errors.title?.message}>
            <Input
              placeholder="Например, разработка сайта"
              aria-invalid={Boolean(form.formState.errors.title)}
              className={cn(form.formState.errors.title && "border-destructive focus:ring-destructive")}
              {...form.register("title")}
            />
          </FormField>

          <FormField label="Описание" error={form.formState.errors.description?.message}>
            <Textarea
              placeholder="Кратко опишите состав услуги и условия работы"
              aria-invalid={Boolean(form.formState.errors.description)}
              className={cn(form.formState.errors.description && "border-destructive focus:ring-destructive")}
              {...form.register("description")}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Цена" error={form.formState.errors.price?.message}>
              <Input
                type="text"
                inputMode="decimal"
                placeholder="Например, 15 000"
                aria-invalid={Boolean(form.formState.errors.price)}
                className={cn(form.formState.errors.price && "border-destructive focus:ring-destructive")}
                {...form.register("price")}
              />
            </FormField>
            <FormField label="Единица услуги" error={form.formState.errors.unit?.message}>
              <Input
                placeholder="Например: проект, час, месяц"
                aria-invalid={Boolean(form.formState.errors.unit)}
                className={cn(form.formState.errors.unit && "border-destructive focus:ring-destructive")}
                {...form.register("unit")}
              />
            </FormField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Предоплата, %" error={form.formState.errors.prepaymentPercent?.message}>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Например, 50"
                aria-invalid={Boolean(form.formState.errors.prepaymentPercent)}
                className={cn(form.formState.errors.prepaymentPercent && "border-destructive focus:ring-destructive")}
                {...form.register("prepaymentPercent")}
              />
            </FormField>
            <FormField label="Срок, дней" error={form.formState.errors.deadlineDays?.message}>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Например, 7"
                aria-invalid={Boolean(form.formState.errors.deadlineDays)}
                className={cn(form.formState.errors.deadlineDays && "border-destructive focus:ring-destructive")}
                {...form.register("deadlineDays")}
              />
            </FormField>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isPending} className="px-6 sm:min-w-[180px]">
              {isPending ? "Сохраняем..." : initialValues?.id ? "Сохранить изменения" : "Создать услугу"}
            </Button>
            {initialValues?.id ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset(defaultValues);
                  onReset?.();
                }}
              >
                Отмена
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
