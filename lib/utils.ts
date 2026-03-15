import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const hasFraction = !Number.isInteger(safeAmount);

  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 2 : 0,
  }).format(safeAmount);
}

export function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "пїЅ?пїЅ";
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
