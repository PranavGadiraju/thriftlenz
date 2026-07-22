"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium tracking-tight transition-all duration-200 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-45 active:scale-[0.98] motion-reduce:active:scale-100 motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary: "bg-ink text-canvas hover:bg-ink-soft",
        accent: "bg-accent text-white hover:bg-accent-hover",
        outline:
          "border border-line-strong bg-transparent text-ink hover:border-ink hover:bg-ink/[0.03]",
        subtle: "bg-accent-soft text-accent-hover hover:bg-accent-soft/70",
        ghost: "text-ink hover:bg-ink/[0.05]",
        link: "rounded-none text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink",
      },
      size: {
        sm: "h-9 px-4 text-[0.8125rem]",
        md: "h-11 px-6 text-sm",
        lg: "h-[52px] px-8 text-[0.9375rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        type={asChild ? undefined : type ?? "button"}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
