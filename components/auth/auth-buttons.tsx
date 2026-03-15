import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthButtonsProps = {
  className?: string;
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
};

export function AuthButtons({
  className,
  orientation = "horizontal",
  fullWidth = false,
}: AuthButtonsProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        orientation === "vertical" ? "flex-col" : "flex-col sm:flex-row",
        fullWidth && "w-full",
        className,
      )}
    >
      <Button asChild className={cn("shadow-sm", fullWidth && "w-full")}>
        <Link href="/register">Зарегистрироваться</Link>
      </Button>
      <Button asChild variant="outline" className={cn("border-slate-200 bg-white/80 text-slate-900 hover:bg-white", fullWidth && "w-full")}>
        <Link href="/login">Войти</Link>
      </Button>
    </div>
  );
}
