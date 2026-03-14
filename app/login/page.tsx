import { redirectAuthenticatedUser } from "@/lib/auth";
import { LoginForm } from "@/components/forms/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  await redirectAuthenticatedUser();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[36px] border bg-[linear-gradient(145deg,rgba(14,87,128,0.95),rgba(25,52,72,0.92))] p-8 text-white shadow-xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/70">SamoDoc</p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-balance sm:text-5xl">
            Вход в рабочий кабинет самозанятого без лишней настройки
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/80">
            Используйте логин и пароль, чтобы быстро вернуться к клиентам, сделкам, документам и напоминаниям.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {["Вход по логину", "Документы по сделке", "Напоминания без хаоса"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm leading-6">
                {item}
              </div>
            ))}
          </div>
        </section>

        <Card className="self-center">
          <CardHeader>
            <CardTitle>Вход в кабинет</CardTitle>
            <CardDescription>
              Введите логин и пароль. После входа вы попадёте в кабинет или на заполнение профиля.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginForm />
            <p className="text-sm leading-6 text-muted-foreground">
              SamoDoc не заменяет «Мой налог» и не ведёт бухгалтерию. Это рабочий кабинет для повседневной работы с
              заказами.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
