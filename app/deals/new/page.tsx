import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DealForm } from "@/components/forms/deal-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/server/auth/get-session-user";
import { prisma } from "@/lib/prisma";
import { serializeServiceTemplate } from "@/lib/serializers";

export default async function NewDealPage() {
  const user = await getSessionUser();
  const [clients, templates] = await Promise.all([
    prisma.client.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
    prisma.serviceTemplate.findMany({ where: { userId: user.id }, orderBy: { title: "asc" } }),
  ]);

  const serializedTemplates = templates.map(serializeServiceTemplate);

  return (
    <AppShell
      user={user}
      title="Новая сделка"
      description="Выберите клиента, укажите стоимость и сохраните основные условия, чтобы дальше работать со статусами, документами и оплатой."
      actions={
        <Button asChild variant="outline">
          <Link href="/deals">К списку сделок</Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DealForm clients={clients} templates={serializedTemplates} />
        <Card>
          <CardHeader>
            <CardTitle>Что важно по новой сделке</CardTitle>
            <CardDescription>
              Ниже собраны подсказки, которые помогают быстрее заполнить карточку и не забыть важные поля.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              В названии удобно указывать тип работы, клиента, этап или формат услуги, чтобы потом быстрее находить
              сделку в списке.
            </p>
            <p>
              Если у вас уже есть шаблон услуги, выберите его в форме: так будет проще сохранить единый подход к
              ценам, срокам и описанию работ.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}