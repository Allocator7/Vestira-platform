import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-electric-blue text-white hover:bg-electric-blue/90 shadow-vestira hover:shadow-vestira-lg border border-electric-blue",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 shadow-vestira hover:shadow-vestira-lg border border-red-500",
        outline:
          "border-2 border-deep-brand bg-white hover:bg-canvas-bg hover:text-deep-brand shadow-vestira hover:shadow-vestira-lg text-deep-brand font-medium",
        secondary:
          "bg-canvas-bg text-deep-brand hover:bg-canvas-bg/80 border border-gray-200 shadow-vestira hover:shadow-vestira-lg",
        ghost: "hover:bg-canvas-bg hover:text-deep-brand transition-colors duration-300",
        link: "text-electric-blue underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
