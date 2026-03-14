"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/server/actions/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  variant?: "ghost" | "outline";
};

export function LogoutButton({ className, variant = "ghost" }: LogoutButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      className={cn(className)}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await logoutUser();
          router.push("/login");
          router.refresh();
        })
      }
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? "Выходим..." : "Выйти"}
    </Button>
  );
}
