import { cn } from "@/lib/utils";
import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-3xl border border-slate-800 bg-slate-950/50 text-slate-100 shadow-sm backdrop-blur-md",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
