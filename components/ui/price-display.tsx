import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type PriceDisplayProps = {
  value: number;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "text-[0.8125rem]",
  md: "text-[0.9375rem]",
  lg: "text-xl",
} as const;

export function PriceDisplay({ value, className, size = "sm" }: PriceDisplayProps) {
  return (
    <span className={cn("tabular-nums text-ink", sizes[size], className)}>
      {formatPrice(value)}
    </span>
  );
}
