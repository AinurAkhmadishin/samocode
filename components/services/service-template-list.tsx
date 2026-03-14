"use client";

import { useMemo, useState, useTransition } from "react";
import { BriefcaseBusiness, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { deleteServiceTemplate } from "@/server/actions/service-templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import type { ClientServiceTemplate } from "@/lib/serializers";
import { ServiceTemplateForm } from "@/components/forms/service-template-form";

export function ServiceTemplateList({ templates }: { templates: ClientServiceTemplate[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ClientServiceTemplate | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return templates;
    }

    return templates.filter((item) =>
      [item.title, item.description, item.unit].filter(Boolean).some((value) => value?.toLowerCase().includes(term)),
    );
  }, [templates, query]);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteServiceTemplate(id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      if (selected?.id === id) {
        setSelected(null);
      }
      toast.success("Услуга удалена");
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Ваши услуги</CardTitle>
          <CardDescription>Подготовьте шаблоны услуг, чтобы быстрее собирать сделки, цены и повторяющиеся условия.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по названию и описанию" className="pl-10" />
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={BriefcaseBusiness} title="Услуги пока не найдены" description="Добавьте первый шаблон услуги, чтобы использовать его в сделках и не вводить все заново." />
          ) : (
            <div className="space-y-3">
              {filtered.map((template) => (
                <div key={template.id} className="rounded-[24px] border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <button type="button" className="text-left" onClick={() => setSelected(template)}>
                      <p className="font-semibold">{template.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{template.description ?? "Без описания"}</p>
                      <p className="mt-2 text-sm font-medium">{formatCurrency(template.price.toString())}{template.unit ? ` / ${template.unit}` : ""}</p>
                    </button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelected(template)}>Редактировать</Button>
                      <Button variant="ghost" size="icon" disabled={isPending} onClick={() => handleDelete(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceTemplateForm
        key={selected?.id ?? "new-template"}
        initialValues={selected ? {
          id: selected.id,
          title: selected.title,
          description: selected.description ?? "",
          price: Number(selected.price),
          prepaymentPercent: selected.prepaymentPercent ?? null,
          deadlineDays: selected.deadlineDays ?? null,
          unit: selected.unit ?? "",
        } : undefined}
        onReset={() => setSelected(null)}
      />
    </div>
  );
}