"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Client, ClientType } from "@prisma/client";
import { Search, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { ClientForm } from "@/components/forms/client-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { deleteClient } from "@/server/actions/clients";

function getClientCountLabel(count: number) {
  if (count === 0) {
    return "Клиентов пока нет";
  }

  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${count} клиент`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} клиента`;
  }

  return `${count} клиентов`;
}

export function ClientList({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Client | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return clients;
    }

    return clients.filter((client) =>
      [client.name, client.companyName, client.contactName, client.email, client.phone, client.inn]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(term)),
    );
  }, [clients, query]);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteClient(id);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (selected?.id === id) {
        setSelected(null);
      }

      toast.success("Клиент удалён");
      router.refresh();
    });
  };

  const hasClients = clients.length > 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Ваши клиенты</CardTitle>
            <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
              {getClientCountLabel(clients.length)}
            </span>
          </div>
          <CardDescription>Ищите, редактируйте и быстро используйте карточки клиентов в новых сделках.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по имени, компании, email или ИНН"
              className="pl-10"
            />
          </div>

          {!hasClients ? (
            <EmptyState
              icon={UserRound}
              title="Пока нет клиентов"
              description="Добавьте первого клиента, чтобы быстрее создавать сделки и документы без повторного ввода данных."
              action={(
                <Button type="button" onClick={() => setSelected(null)}>
                  Создать клиента
                </Button>
              )}
            />
          ) : filtered.length === 0 ? (
            <div className="rounded-[24px] border border-dashed px-5 py-8 text-center">
              <p className="font-semibold">Ничего не найдено</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Попробуйте изменить запрос и поискать по имени, компании, email или ИНН.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((client) => {
                const isCompany = client.type === "company";
                const displayName = isCompany ? client.companyName || client.name : client.name;

                return (
                  <div
                    key={client.id}
                    className={cn(
                      "rounded-[24px] border p-4 transition hover:border-foreground/20 hover:shadow-sm",
                      selected?.id === client.id && "border-foreground/20 shadow-sm",
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <button
                        type="button"
                        className="flex-1 cursor-pointer text-left"
                        onClick={() => setSelected(client)}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{displayName}</p>
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                            {isCompany ? "Компания" : "Физлицо"}
                          </span>
                        </div>

                        {isCompany && client.contactName ? (
                          <p className="mt-2 text-sm text-muted-foreground">Контактное лицо: {client.contactName}</p>
                        ) : null}

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <span>{client.phone || "Телефон не указан"}</span>
                          <span>{client.email || "Email не указан"}</span>
                          {isCompany && client.inn ? <span>ИНН: {client.inn}</span> : null}
                        </div>
                      </button>

                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setSelected(client)}>
                          Редактировать
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          onClick={() => handleDelete(client.id)}
                          aria-label="Удалить клиента"
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

      <ClientForm
        key={selected?.id ?? "new-client"}
        initialValues={selected ? {
          id: selected.id,
          type: selected.type as ClientType,
          name: selected.type === "company" ? selected.companyName ?? selected.name : selected.name,
          contactName: selected.contactName ?? "",
          phone: selected.phone ?? "",
          email: selected.email ?? "",
          companyName: selected.companyName ?? "",
          inn: selected.inn ?? "",
          notes: selected.notes ?? "",
        } : undefined}
        onReset={() => setSelected(null)}
      />
    </div>
  );
}
