"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface ScreenProps {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

const Screen: React.FC<ScreenProps> = ({ children, className, noPadding = false }) => {
  return (
    <div className={cn("flex flex-col min-h-screen", className)}>
      {noPadding ? children : <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8 max-w-7xl">{children}</div>}
    </div>
  )
}

export { Screen }
export default Screen
