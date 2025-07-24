"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast, type Toast as ToastType } from "./use-toast"

const Toast = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div"> & ToastType>(
  ({ className, variant = "default", title, description, id, ...props }, ref) => {
    const { dismiss } = useToast()

    const variantStyles = {
      default: "bg-white border-gray-200 text-gray-900",
      destructive: "bg-red-50 border-red-200 text-red-900",
      success: "bg-green-50 border-green-200 text-green-900",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    }

    const icons = {
      default: Info,
      destructive: AlertCircle,
      success: CheckCircle,
      warning: AlertTriangle,
    }

    const Icon = icons[variant]

    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
          "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
          variantStyles[variant],
          className,
        )}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div className="grid gap-1">
            {title && <div className="text-sm font-semibold">{title}</div>}
            {description && <div className="text-sm opacity-90">{description}</div>}
          </div>
        </div>
        <button
          onClick={() => id && dismiss(id)}
          className="absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  },
)
Toast.displayName = "Toast"

export { Toast }
