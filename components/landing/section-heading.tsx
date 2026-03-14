import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/70">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-balance sm:text-4xl">{title}</h2>
      <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </div>
  );
}
