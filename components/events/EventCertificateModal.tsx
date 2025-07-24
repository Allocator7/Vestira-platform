"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Award, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface EventCertificateModalProps {
  event: any
  isOpen: boolean
  onClose: () => void
}

export function EventCertificateModal({ event, isOpen, onClose }: EventCertificateModalProps) {
  const { toast } = useToast()

  if (!event) return null

  const handleDownload = () => {
    // Create a simple certificate content for download
    const certificateContent = `
CERTIFICATE OF COMPLETION

This certifies that John Doe has successfully completed:

${event.title}
Organized by: ${event.organizer}
Date: ${new Date(event.date).toLocaleDateString()}
Location: ${event.location}
Duration: ${event.time}

Certificate ID: CERT-${event.id}-2025-${Math.random().toString(36).substr(2, 9).toUpperCase()}

This certificate is awarded in recognition of successful participation and completion of the above event.
  `.trim()

    // Create and download the file
    const blob = new Blob([certificateContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `Certificate-${event.title.replace(/[^a-zA-Z0-9]/g, "-")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast({
      title: "Certificate Downloaded",
      description: "Your certificate has been downloaded successfully.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Certificate of Completion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Compact Certificate Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg border-2 border-blue-200">
            <div className="text-center space-y-3">
              <div className="flex justify-center">
                <Award className="h-12 w-12 text-yellow-500" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">Certificate of Completion</h2>
                <p className="text-sm text-gray-600 mt-1">This certifies that</p>
              </div>

              <div className="py-2">
                <h3 className="text-2xl font-bold text-blue-900">John Doe</h3>
                <p className="text-sm text-gray-600 mt-1">has successfully completed</p>
              </div>

              <div className="bg-white p-3 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{event.organizer}</p>
              </div>

              <div className="flex justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-blue-200">
                <p className="text-xs text-gray-500">
                  Certificate ID: CERT-{event.id}-2025-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Compact Event Details */}
          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg">
            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Event Details</h4>
              <div className="space-y-1 text-gray-600">
                <div>Completed: {new Date(event.date).toLocaleDateString()}</div>
                <div>Duration: {event.time}</div>
                <div>
                  <Badge variant="secondary" className="text-xs">
                    {event.type}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-gray-900">Completion Status</h4>
              <div className="space-y-1 text-gray-600">
                <div>Attendance: 100%</div>
                <div>Status: Completed</div>
                <div>Grade: Pass</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
