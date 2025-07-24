import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-baseGray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric-blue/50 focus-visible:border-electric-blue disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 shadow-vestira focus:shadow-vestira-lg text-deepBrand",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
