"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerUser } from "@/server/actions/auth";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await registerUser(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const redirectTo = result.redirectTo ?? "/onboarding";
      toast.success("Аккаунт создан");
      router.push(redirectTo);
      router.refresh();
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField label="Логин" error={form.formState.errors.login?.message}>
        <Input autoComplete="username" placeholder="new-user" {...form.register("login")} />
      </FormField>
      <FormField label="Пароль" error={form.formState.errors.password?.message}>
        <Input type="password" autoComplete="new-password" placeholder="Придумайте пароль" {...form.register("password")} />
      </FormField>
      <FormField label="Подтверждение пароля" error={form.formState.errors.confirmPassword?.message}>
        <Input
          type="password"
          autoComplete="new-password"
          placeholder="Повторите пароль"
          {...form.register("confirmPassword")}
        />
      </FormField>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Создаём аккаунт..." : "Зарегистрироваться"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Войти
        </Link>
      </p>
    </form>
  );
}
