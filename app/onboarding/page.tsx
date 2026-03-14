import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { OnboardingForm } from "@/components/forms/onboarding-form";
import { Card } from "@/components/ui/card";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.profile?.profession && user.profile?.fullName && user.profile?.inn) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="bg-[linear-gradient(160deg,rgba(249,238,216,0.96),rgba(255,255,255,0.96))] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Первый вход
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight">Заполним профиль исполнителя</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Это нужно, чтобы автоматически подставлять ваши данные в документы и открывать все приватные разделы кабинета.
          </p>
          <ul className="mt-8 space-y-3 text-sm leading-6 text-foreground">
            <li>Профессия и ФИО попадут в договоры и акты.</li>
            <li>ИНН обязателен для рабочего профиля самозанятого.</li>
            <li>Телефон и город помогут быстрее оформлять сделки.</li>
          </ul>
        </Card>

        <OnboardingForm
          defaultValues={{
            profession: user.profile?.profession ?? "",
            fullName: user.profile?.fullName ?? "",
            inn: user.profile?.inn ?? "",
            phone: user.profile?.phone ?? "",
            city: user.profile?.city ?? "",
          }}
        />
      </div>
    </div>
  );
}
