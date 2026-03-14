import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block aspect-square shrink-0 rounded-full border-2 border-primary/20 border-t-primary align-middle animate-spin",
        className,
      )}
    />
  );
}