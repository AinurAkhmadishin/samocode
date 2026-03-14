import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "�?�";
  }

  const date = value instanceof Date ? value : new Date(value);
  return format(date, "d MMMM yyyy", { locale: ru });
}

export function toNumberString(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

