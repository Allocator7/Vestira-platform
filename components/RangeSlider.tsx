"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface RangeSliderProps {
  min: number
  max: number
  step?: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  formatValue?: (value: number) => string
  label?: string
  className?: string
}

export function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (val) => val.toString(),
  label,
  className,
}: RangeSliderProps) {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <div className={cn("space-y-3", className)}>
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <div className="px-2">
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onValueChange={onChange}
          onPointerDown={() => setIsDragging(true)}
          onPointerUp={() => setIsDragging(false)}
          className={cn("transition-all duration-200", isDragging && "scale-105")}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-500">
        <span className={cn("transition-colors duration-200", isDragging && "text-primary font-medium")}>
          {formatValue(value[0])}
        </span>
        <span className={cn("transition-colors duration-200", isDragging && "text-primary font-medium")}>
          {formatValue(value[1])}
        </span>
      </div>
    </div>
  )
}
