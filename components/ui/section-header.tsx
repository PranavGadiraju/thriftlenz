import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-eyebrow uppercase text-accent">{eyebrow}</p>
      ) : null}
      <Heading
        className={cn(
          "font-display font-normal tracking-[-0.02em] text-ink",
          eyebrow && "mt-3",
          Heading === "h1"
            ? "text-[2.25rem] leading-[1.05] sm:text-5xl"
            : "text-[1.75rem] leading-[1.1] sm:text-[2.5rem]",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{description}</p>
      ) : null}
    </div>
  );
}
