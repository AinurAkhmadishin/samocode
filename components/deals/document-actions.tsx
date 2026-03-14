"use client";

import { useTransition } from "react";
import type { DocumentType } from "@prisma/client";
import { FileCheck2, FileSignature, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { generateDocument } from "@/server/actions/documents";
import { Button } from "@/components/ui/button";

const documentConfig: Record<DocumentType, { label: string; icon: typeof FileSignature }> = {
  contract: { label: "Договор", icon: FileSignature },
  act: { label: "Акт", icon: FileCheck2 },
  invoice: { label: "Счет", icon: ReceiptText },
};

export function DocumentActions({ dealId }: { dealId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = (type: DocumentType) => {
    const nextTab = window.open("", "_blank", "noopener,noreferrer");

    startTransition(async () => {
      const result = await generateDocument({ dealId, type });

      if (!result.success || !result.url) {
        nextTab?.close();
        toast.error(result.error ?? "Не удалось сформировать документ");
        return;
      }

      if (nextTab) {
        nextTab.location.href = result.url;
      } else {
        window.open(result.url, "_blank", "noopener,noreferrer");
      }

      toast.success("Документ открыт в новой вкладке");
    });
  };

  return (
    <div className="flex flex-wrap gap-3">
      {(Object.entries(documentConfig) as Array<[DocumentType, { label: string; icon: typeof FileSignature }]>).map(([type, config]) => {
        const Icon = config.icon;

        return (
          <Button key={type} type="button" variant="secondary" onClick={() => handleGenerate(type)} disabled={isPending}>
            <Icon className="h-4 w-4" />
            {config.label}
          </Button>
        );
      })}
    </div>
  );
}