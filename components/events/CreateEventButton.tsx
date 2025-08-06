"use client"

import { useState } from "react"
import { useSession } from "../../context/SessionContext"
import { Button } from "../ui/button"
import { Plus, Calendar } from "lucide-react"
import { CreateEventModal } from "../industry-group/CreateEventModal"

export function CreateEventButton() {
  const { userRole } = useSession()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Only show for roles that can create events
  const canCreateEvents = userRole === "manager" || userRole === "consultant" || userRole === "industry-group"

  if (!canCreateEvents) {
    return null
  }

  return (
    <>
      <Button 
        onClick={() => setIsCreateModalOpen(true)}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Create Event
      </Button>

      <CreateEventModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}