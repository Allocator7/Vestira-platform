import type React from "react"
import { type ButtonHTMLAttributes, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof Button> {
  isLoading?: boolean
  loadingText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  spinnerClassName?: string
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      isLoading = false,
      loadingText,
      disabled,
      startIcon,
      endIcon,
      spinnerClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        className={cn(className)}
        variant={variant}
        size={size}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" className={spinnerClassName} />
            {loadingText || children}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {startIcon}
            {children}
            {endIcon}
          </div>
        )}
      </Button>
    )
  },
)

LoadingButton.displayName = "LoadingButton"
