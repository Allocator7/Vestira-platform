"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface EventCalendarProps {
  events: any[]
  onEventClick?: (event: any) => void
}

export function EventCalendar({ events, onEventClick }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return events.filter((event) => event.date === dateStr)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {daysOfWeek.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {Array.from({ length: totalCells }, (_, i) => {
            const dayNumber = i - firstDayOfMonth + 1
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth
            const dayEvents = isCurrentMonth ? getEventsForDate(dayNumber) : []
            const isToday =
              isCurrentMonth &&
              dayNumber === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear()

            return (
              <div
                key={i}
                className={`
                  p-1 h-24 border border-gray-200 text-sm overflow-hidden
                  ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                  ${isToday ? "bg-blue-50 border-blue-300" : ""}
                  ${dayEvents.length > 0 ? "cursor-pointer hover:bg-gray-50" : ""}
                `}
                onClick={() => dayEvents.length > 0 && onEventClick?.(dayEvents[0])}
              >
                {isCurrentMonth && (
                  <>
                    <div className={`font-medium ${isToday ? "text-blue-600" : "text-gray-900"}`}>{dayNumber}</div>
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div
                          key={idx}
                          className={`text-xs px-1 py-0.5 rounded truncate ${
                            event.status === "registered" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Registered Events</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>Completed Events</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
