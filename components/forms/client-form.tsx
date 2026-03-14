"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ClientType } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

  const onSubmit = form.handleSubmit(
    (values) => {
      startTransition(async () => {
        const payload = isEditing ? values : { ...values, id: undefined };
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
        <CardDescription>
          Сохраните контактные данные клиента, чтобы использовать их в сделках и документах.
        </CardDescription>
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
          <FormField label="Имя клиента" error={form.formState.errors.name?.message}>
            <Input
              placeholder="Например, Анна Смирнова"
              aria-invalid={Boolean(form.formState.errors.name)}
              className={cn(form.formState.errors.name && "border-destructive focus:ring-destructive")}
              {...form.register("name")}
            />
          </FormField>
          <FormField label="Контактное лицо" error={form.formState.errors.contactName?.message}>
            <Input
              placeholder="Если общаетесь не с основным заказчиком"
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
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Компания" error={form.formState.errors.companyName?.message}>
              <Input
                placeholder="ООО Ромашка"
                aria-invalid={Boolean(form.formState.errors.companyName)}
                className={cn(form.formState.errors.companyName && "border-destructive focus:ring-destructive")}
                {...form.register("companyName")}
              />
            </FormField>
            <FormField label="ИНН" error={form.formState.errors.inn?.message}>
              <Input
                placeholder="10 или 12 цифр"
                aria-invalid={Boolean(form.formState.errors.inn)}
                className={cn(form.formState.errors.inn && "border-destructive focus:ring-destructive")}
                {...form.register("inn")}
              />
            </FormField>
          </div>
          <FormField label="Комментарий" error={form.formState.errors.notes?.message}>
            <Textarea
              placeholder="Важные детали по клиенту или предпочтения по работе"
              aria-invalid={Boolean(form.formState.errors.notes)}
              className={cn(form.formState.errors.notes && "border-destructive focus:ring-destructive")}
              {...form.register("notes")}
            />
          </FormField>
          <div className="flex gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Сохраняем..." : isEditing ? "Сохранить" : "Создать клиента"}
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
