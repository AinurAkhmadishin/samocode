"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ServiceTemplateForm } from "@/components/forms/service-template-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import type { ClientServiceTemplate } from "@/lib/serializers";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { deleteServiceTemplate } from "@/server/actions/service-templates";

function getTemplateCountLabel(count: number) {
  if (count === 0) {
    return "Шаблонов пока нет";
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} услуга`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} услуги`;
  }

  return `${count} услуг`;
}

function formatTemplateMeta(template: ClientServiceTemplate) {
  const items = [] as string[];

  if (template.prepaymentPercent !== null) {
    items.push(`Предоплата: ${template.prepaymentPercent}%`);
  }

  if (template.deadlineDays !== null) {
    items.push(`Срок: ${template.deadlineDays} дн.`);
  }

  return items;
}

function toFormNumber(value: number | null | undefined) {
  return value === null || value === undefined ? "" : String(value);
}

export function ServiceTemplateList({ templates }: { templates: ClientServiceTemplate[] }) {
  const router = useRouter();
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

      toast.success("Шаблон услуги удалён");
      router.refresh();
    });
  };

  const hasTemplates = templates.length > 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Ваши услуги</CardTitle>
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              {getTemplateCountLabel(templates.length)}
            </span>
          </div>
          <CardDescription>Подготовьте шаблоны услуг, чтобы быстрее собирать сделки, цены и повторяющиеся условия.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по названию и описанию"
              className="pl-10"
            />
          </div>

          {!hasTemplates ? (
            <EmptyState
              icon={BriefcaseBusiness}
              title="Пока нет шаблонов услуг"
              description="Создайте первую типовую услугу, чтобы быстрее собирать сделки и не вводить одинаковые данные вручную."
              action={(
                <Button type="button" onClick={() => setSelected(null)}>
                  Создать услугу
                </Button>
              )}
            />
          ) : filtered.length === 0 ? (
            <div className="rounded-[24px] border border-dashed px-5 py-8 text-center">
              <p className="font-semibold">Ничего не найдено</p>
              <p className="mt-2 text-sm text-muted-foreground">Попробуйте изменить запрос и поискать по названию или описанию.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((template) => {
                const meta = formatTemplateMeta(template);

                return (
                  <div
                    key={template.id}
                    className={cn(
                      "rounded-[24px] border p-4 transition hover:border-foreground/20 hover:shadow-sm",
                      selected?.id === template.id && "border-foreground/20 shadow-sm",
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <button
                        type="button"
                        className="flex-1 cursor-pointer text-left"
                        onClick={() => setSelected(template)}
                      >
                        <p className="font-semibold">{template.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {template.description || "Описание не добавлено"}
                        </p>
                        <p className="mt-3 text-sm font-medium">
                          {formatCurrency(template.price.toString())}
                          {template.unit ? ` / ${template.unit}` : ""}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {meta.length > 0 ? meta.join(" · ") : "Цена и условия будут готовы для следующей сделки"}
                        </p>
                      </button>

                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(template)}>
                          Редактировать
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          onClick={() => handleDelete(template.id)}
                          aria-label="Удалить шаблон услуги"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
          price: toFormNumber(selected.price),
          prepaymentPercent: toFormNumber(selected.prepaymentPercent),
          deadlineDays: toFormNumber(selected.deadlineDays),
          unit: selected.unit ?? "",
        } : undefined}
        onReset={() => setSelected(null)}
      />
    </div>
  );
}
