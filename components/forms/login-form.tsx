"use client";

import Link from "next/link";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginUser } from "@/server/actions/auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginUser(values);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      const redirectTo = nextPath && nextPath.startsWith("/") ? nextPath : result.redirectTo ?? "/dashboard";
      toast.success("Вход выполнен");
      router.push(redirectTo);
      router.refresh();
    });
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <FormField label="Логин" error={form.formState.errors.login?.message}>
        <Input autoComplete="username" placeholder="admin" {...form.register("login")} />
      </FormField>
      <FormField label="Пароль" error={form.formState.errors.password?.message}>
        <Input type="password" autoComplete="current-password" placeholder="Введите пароль" {...form.register("password")} />
      </FormField>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Входим..." : "Войти"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
          Зарегистрироваться
        </Link>
      </p>
    </form>
  );
}
