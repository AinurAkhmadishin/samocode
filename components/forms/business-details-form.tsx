"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { businessDetailsSchema, type BusinessDetailsInput } from "@/lib/validations/profile";
import { updateBusinessDetails } from "@/server/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

const legalStatusLabels: Record<string, string> = {
  self_employed: "Самозанятый",
  individual_entrepreneur: "ИП",
  company: "Компания / ООО",
};

const legalStatusOptions = [
  { value: "self_employed", label: legalStatusLabels.self_employed },
  { value: "individual_entrepreneur", label: legalStatusLabels.individual_entrepreneur },
  { value: "company", label: legalStatusLabels.company },
];

export function BusinessDetailsForm({ initialValues }: { initialValues: BusinessDetailsInput }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<BusinessDetailsInput>({
    resolver: zodResolver(businessDetailsSchema),
    defaultValues: initialValues,
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await updateBusinessDetails(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Реквизиты обновлены");
    });
  });

  const currentLegalStatus = form.watch("legalStatus");
  const showCustomStatus = currentLegalStatus && !legalStatusOptions.some((option) => option.value === currentLegalStatus);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Реквизиты и оплата</CardTitle>
        <CardDescription>Эти поля нужны для документов, подписи и сведений по оплате.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          <FormField label="Статус" error={form.formState.errors.legalStatus?.message}>
            <select className="flex h-11 w-full rounded-2xl border bg-white px-4 text-sm" {...form.register("legalStatus")}>
              {legalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
              {showCustomStatus ? <option value={currentLegalStatus}>{currentLegalStatus}</option> : null}
            </select>
          </FormField>
          <FormField label="Отображаемое имя" error={form.formState.errors.displayName?.message}><Input {...form.register("displayName")} /></FormField>
          <FormField label="Подписант" error={form.formState.errors.signerName?.message}><Input {...form.register("signerName")} /></FormField>
          <FormField label="Email для документов" error={form.formState.errors.emailForDocs?.message}><Input {...form.register("emailForDocs")} /></FormField>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Телефон для оплаты" error={form.formState.errors.paymentPhone?.message}><Input {...form.register("paymentPhone")} /></FormField>
            <FormField label="Банк" error={form.formState.errors.paymentBank?.message}><Input {...form.register("paymentBank")} /></FormField>
          </div>
          <FormField label="Маска карты" error={form.formState.errors.paymentCardMask?.message}><Input placeholder="0000 00** **** 1234" {...form.register("paymentCardMask")} /></FormField>
          <Button type="submit" disabled={isPending}>{isPending ? "Сохраняем..." : "Сохранить реквизиты"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}