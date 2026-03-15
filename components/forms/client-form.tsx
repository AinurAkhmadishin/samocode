"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ClientType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { clientSchema, type ClientInput } from "@/lib/validations/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const defaultValues: ClientInput = {
  type: ClientType.person,
  name: "",
  contactName: "",
  phone: "",
  email: "",
  companyName: "",
  inn: "",
  notes: "",
};

export function ClientForm({ initialValues, onReset }: { initialValues?: ClientInput; onReset?: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: initialValues ?? defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldUnregister: true,
  });

  const isEditing = Boolean(initialValues?.id);
  const clientType = useWatch({ control: form.control, name: "type" }) ?? ClientType.person;
  const isCompany = clientType === ClientType.company;

  useEffect(() => {
    if (!isCompany) {
      form.clearErrors(["companyName", "inn"]);
    }
  }, [form, isCompany]);

  const onSubmit = form.handleSubmit(
    (values) => {
      const payload: ClientInput = {
        ...values,
        id: values.id || undefined,
        name: values.name.trim(),
        companyName: values.type === ClientType.company ? values.name.trim() : "",
        inn: values.type === ClientType.company ? values.inn ?? "" : "",
      };

      startTransition(async () => {
        const response = await fetch("/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = (await response.json()) as { success: boolean; error?: string };

        if (!response.ok || !result.success) {
          toast.error(result.error ?? "Не удалось сохранить клиента");
          return;
        }

        toast.success(isEditing ? "Клиент обновлён" : "Клиент создан");
        form.reset(defaultValues);
        onReset?.();
        router.refresh();
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
        <CardTitle>{isEditing ? "Редактирование клиента" : "Новый клиент"}</CardTitle>
        <CardDescription>Сохраните клиента, чтобы использовать его в сделках и документах.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {isEditing ? <input type="hidden" {...form.register("id")} /> : null}

          <FormField label="Тип клиента" error={form.formState.errors.type?.message}>
            <select
              className={cn(
                "flex h-11 w-full rounded-2xl border bg-white px-4 text-sm",
                form.formState.errors.type && "border-destructive focus:ring-destructive",
              )}
              aria-invalid={Boolean(form.formState.errors.type)}
              {...form.register("type")}
            >
              <option value={ClientType.person}>Физлицо</option>
              <option value={ClientType.company}>Компания</option>
            </select>
          </FormField>

          <FormField
            label={isCompany ? "Название компании" : "Имя клиента"}
            error={form.formState.errors.name?.message}
          >
            <Input
              placeholder={isCompany ? "Например, ООО Ромашка" : "Например, Анна Смирнова"}
              aria-invalid={Boolean(form.formState.errors.name)}
              className={cn(form.formState.errors.name && "border-destructive focus:ring-destructive")}
              {...form.register("name")}
            />
          </FormField>

          <FormField label="Контактное лицо" error={form.formState.errors.contactName?.message}>
            <Input
              placeholder={isCompany ? "Кто ведёт коммуникацию по заказу" : "Если общаетесь не с основным заказчиком"}
              aria-invalid={Boolean(form.formState.errors.contactName)}
              className={cn(form.formState.errors.contactName && "border-destructive focus:ring-destructive")}
              {...form.register("contactName")}
            />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Телефон" error={form.formState.errors.phone?.message}>
              <Input
                placeholder="+7 900 000-00-00"
                aria-invalid={Boolean(form.formState.errors.phone)}
                className={cn(form.formState.errors.phone && "border-destructive focus:ring-destructive")}
                {...form.register("phone")}
              />
            </FormField>
            <FormField label="Email" error={form.formState.errors.email?.message}>
              <Input
                placeholder="client@example.com"
                aria-invalid={Boolean(form.formState.errors.email)}
                className={cn(form.formState.errors.email && "border-destructive focus:ring-destructive")}
                {...form.register("email")}
              />
            </FormField>
          </div>

          {isCompany ? (
            <FormField label="ИНН" error={form.formState.errors.inn?.message}>
              <Input
                placeholder="10 или 12 цифр"
                inputMode="numeric"
                aria-invalid={Boolean(form.formState.errors.inn)}
                className={cn(form.formState.errors.inn && "border-destructive focus:ring-destructive")}
                {...form.register("inn")}
              />
            </FormField>
          ) : null}

          <FormField label="Комментарий" error={form.formState.errors.notes?.message}>
            <Textarea
              placeholder={isCompany
                ? "Важные детали по клиенту или особенности по работе"
                : "Важные детали по клиенту или предпочтения по работе"}
              aria-invalid={Boolean(form.formState.errors.notes)}
              className={cn(form.formState.errors.notes && "border-destructive focus:ring-destructive")}
              {...form.register("notes")}
            />
          </FormField>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={isPending} className="px-6 sm:min-w-[180px]">
              {isPending ? "Сохраняем..." : isEditing ? "Сохранить изменения" : "Создать клиента"}
            </Button>
            {isEditing ? (
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
