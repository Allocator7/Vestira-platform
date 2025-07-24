import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-electric-blue text-white hover:bg-electric-blue/90 shadow-sm",
        secondary: "border-transparent bg-canvas-bg text-deep-brand hover:bg-canvas-bg/80 shadow-sm",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline: "text-deep-brand border-deep-brand bg-white hover:bg-canvas-bg shadow-sm",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-sm",
        warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
