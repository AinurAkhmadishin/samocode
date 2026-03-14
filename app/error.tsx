"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ru">
      <body className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-md rounded-3xl border bg-card p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Ошибка
          </p>
          <h1 className="mt-3 text-2xl font-semibold">Что-то пошло не так</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Мы не смогли загрузить страницу. Попробуйте повторить действие еще раз.
          </p>
          <Button className="mt-6 w-full" onClick={reset}>
            Обновить страницу
          </Button>
        </div>
      </body>
    </html>
  );
}
