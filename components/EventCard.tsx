"use client"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EventCardProps {
  title: string
  date: string
  time: string
  host: string
  onRegister?: () => void
}

export default function EventCard({ title, date, time, host, onRegister }: EventCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-canvas-bg transition-colors">
      <div className="p-3 bg-deep-brand/10 rounded-md">
        <Calendar className="h-5 w-5 text-deep-brand" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-deep-brand">{title}</h3>
        <p className="text-sm text-base-gray">{host}</p>
      </div>
      <div className="text-right">
        <p className="font-medium text-sm text-deep-brand">{date}</p>
        <p className="text-xs text-base-gray">{time}</p>
      </div>
      {onRegister && (
        <Button onClick={onRegister} className="ml-4 bg-deep-brand hover:bg-deep-brand/90 text-white" size="sm">
          Register
        </Button>
      )}
    </div>
  )
}
