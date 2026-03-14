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
      <Button asChild variant="outline" className={cn(fullWidth && "w-full")}>
        <Link href="/login">Войти</Link>
      </Button>
      <Button asChild className={cn(fullWidth && "w-full")}>
        <Link href="/register">Зарегистрироваться</Link>
      </Button>
    </div>
  );
}
