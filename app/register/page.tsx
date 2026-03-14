import { redirectAuthenticatedUser } from "@/lib/auth";
import { RegisterForm } from "@/components/forms/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RegisterPage() {
  await redirectAuthenticatedUser();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[36px] border bg-[linear-gradient(145deg,rgba(247,239,223,0.98),rgba(255,255,255,0.95))] p-8 text-slate-950 shadow-xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">SamoDoc</p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-balance sm:text-5xl">
            Зарегистрируйтесь и настройте свой рабочий кабинет за пару минут
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            Создайте аккаунт, чтобы вести клиентов, сделки, документы и напоминания в одном месте. После регистрации вы
            сразу попадёте в онбординг и сможете заполнить профиль.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {["Быстрая регистрация", "Безопасный вход", "Профиль за пару шагов"].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-200 bg-white/90 p-4 text-sm leading-6 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <Card className="self-center">
          <CardHeader>
            <CardTitle>Регистрация</CardTitle>
            <CardDescription>
              Придумайте логин и пароль для входа. Пароль будет надёжно сохранён в виде hash.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
