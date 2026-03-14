"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Client, ClientType } from "@prisma/client";
import { Search, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { deleteClient } from "@/server/actions/clients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ClientForm } from "@/components/forms/client-form";

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
      [client.name, client.companyName, client.email, client.phone, client.inn]
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

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Ваши клиенты</CardTitle>
          <CardDescription>Ищите, редактируйте и быстро переиспользуйте карточки клиентов в новых сделках.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по имени, компании, email или ИНН" className="pl-10" />
          </div>
          {filtered.length === 0 ? (
            <EmptyState icon={UserRound} title="Клиенты пока не найдены" description="Добавьте первого клиента, чтобы использовать его в сделках и документах." />
          ) : (
            <div className="space-y-3">
              {filtered.map((client) => (
                <div key={client.id} className="rounded-[24px] border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <button type="button" className="text-left" onClick={() => setSelected(client)}>
                      <p className="font-semibold">{client.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {client.type === "company" ? "Компания" : "Физлицо"}
                        {client.companyName ? ` - ${client.companyName}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {[client.phone, client.email, client.inn].filter(Boolean).join(" - ") || "Контактные данные не заполнены"}
                      </p>
                    </button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelected(client)}>
                        Редактировать
                      </Button>
                      <Button variant="ghost" size="icon" disabled={isPending} onClick={() => handleDelete(client.id)}>
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

      <ClientForm
        key={selected?.id ?? "new-client"}
        initialValues={selected ? {
          id: selected.id,
          type: selected.type as ClientType,
          name: selected.name,
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
