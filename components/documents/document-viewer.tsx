"use client";

import { useRef } from "react";
import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentViewer({ html, title, pdfUrl }: { html: string; title: string; pdfUrl: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const printDocument = () => {
    const iframeWindow = iframeRef.current?.contentWindow;

    if (!iframeWindow) {
      return;
    }

    iframeWindow.focus();
    iframeWindow.print();
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8f3eb_0%,_#efe6d9_100%)] p-4 sm:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-[28px] border border-white/80 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5 print:hidden">
          <div>
            <p className="text-lg font-semibold text-foreground">{title}</p>
            <p className="text-sm text-muted-foreground">Документ открыт в новой вкладке. Его можно распечатать или скачать отдельным PDF-файлом.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={printDocument}>
              <Printer className="h-4 w-4" />
              Печать
            </Button>
            <Button asChild>
              <a href={pdfUrl}>
                <Download className="h-4 w-4" />
                Скачать PDF
              </a>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-[0_20px_60px_rgba(58,38,17,0.12)]">
          <iframe
            ref={iframeRef}
            title={title}
            srcDoc={html}
            className="min-h-[calc(100vh-10rem)] w-full border-0 bg-white"
            sandbox="allow-modals allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}