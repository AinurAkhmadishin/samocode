import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SamoDoc",
  description: "Рабочий кабинет для самозанятых исполнителей: клиенты, сделки, документы и напоминания.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" id="top">
      <body className={manrope.variable}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
