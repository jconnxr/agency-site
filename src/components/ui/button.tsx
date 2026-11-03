import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// shadcn/ui-style button, skinned for the brand.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-wheat text-ink hover:bg-[#d4972b]",
        solid: "bg-flag text-white hover:bg-flag-dark",
        outline: "border-2 border-ink/80 text-ink hover:bg-ink hover:text-paper",
        ghost: "text-ink hover:bg-sky",
      },
      size: {
        sm: "h-10 px-4 text-[0.95rem] rounded-sm",
        md: "h-12 px-6 text-base rounded-sm",
        lg: "h-14 px-7 text-[1.05rem] rounded-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  }
);
Button.displayName = "Button";

export { buttonVariants };
