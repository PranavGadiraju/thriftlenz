import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-line-strong bg-surface/60 px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
        {icon}
      </span>
      <h2 className="mt-6 font-display text-2xl tracking-[-0.02em] text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {actionLabel && actionHref ? (
        <Button asChild className="mt-7">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
      {actionLabel && !actionHref && onAction ? (
        <Button className="mt-7" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
