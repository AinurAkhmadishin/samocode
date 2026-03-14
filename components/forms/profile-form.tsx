"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { updateProfile } from "@/server/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ProfileForm({ initialValues }: { initialValues: ProfileInput }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateProfile(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Профиль обновлён");
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Профиль исполнителя</CardTitle>
        <CardDescription>Эти данные используются в вашем кабинете и в подготовке документов.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <FormField label="Профессия" error={form.formState.errors.profession?.message}><Input {...form.register("profession")} /></FormField>
          <FormField label="ФИО" error={form.formState.errors.fullName?.message}><Input {...form.register("fullName")} /></FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Телефон" error={form.formState.errors.phone?.message}><Input {...form.register("phone")} /></FormField>
            <FormField label="ИНН" error={form.formState.errors.inn?.message}><Input {...form.register("inn")} /></FormField>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Город" error={form.formState.errors.city?.message}><Input {...form.register("city")} /></FormField>
            <FormField label="Telegram" error={form.formState.errors.telegram?.message}><Input {...form.register("telegram")} /></FormField>
          </div>
          <FormField label="Сайт" error={form.formState.errors.website?.message}><Input placeholder="https://example.com" {...form.register("website")} /></FormField>
          <FormField label="О себе" error={form.formState.errors.about?.message}><Textarea {...form.register("about")} /></FormField>
          <Button type="submit" disabled={isPending}>{isPending ? "Сохраняем..." : "Сохранить профиль"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
