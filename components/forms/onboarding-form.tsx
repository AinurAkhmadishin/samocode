"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { onboardingSchema, type OnboardingInput } from "@/lib/validations/profile";
import { saveOnboarding } from "@/server/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function OnboardingForm({ defaultValues }: { defaultValues: OnboardingInput }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveOnboarding(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Профиль заполнен");
      router.push("/dashboard");
      router.refresh();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Данные исполнителя</CardTitle>
        <CardDescription>
          Заполните основные поля, чтобы продолжить работу внутри кабинета.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <FormField label="Профессия" error={form.formState.errors.profession?.message}>
            <Input placeholder="Например, дизайнер, копирайтер или маркетолог" {...form.register("profession")} />
          </FormField>
          <FormField label="ФИО" error={form.formState.errors.fullName?.message}>
            <Input placeholder="Введите полное имя исполнителя" {...form.register("fullName")} />
          </FormField>
          <FormField label="ИНН" error={form.formState.errors.inn?.message}>
            <Input placeholder="12 цифр" {...form.register("inn")} />
          </FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Телефон" error={form.formState.errors.phone?.message}>
              <Input placeholder="+7 900 000-00-00" {...form.register("phone")} />
            </FormField>
            <FormField label="Город" error={form.formState.errors.city?.message}>
              <Input placeholder="Екатеринбург" {...form.register("city")} />
            </FormField>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Сохраняем..." : "Сохранить"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
