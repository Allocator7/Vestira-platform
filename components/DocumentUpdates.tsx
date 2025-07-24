import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FolderOpen, Clock, Eye } from "lucide-react"
import { useSession } from "next-auth/react"

interface DocumentUpdatesProps {
  dataRoomId: string
}

// Sample updates data
const updates = [
  {
    id: "1",
    dataRoomId: "1",
    type: "document_added",
    documentName: "Q1 2023 Strategy Update",
    date: "2023-04-15T10:30:00Z",
    user: "Sarah Johnson",
  },
  {
    id: "2",
    dataRoomId: "1",
    type: "document_updated",
    documentName: "Investment Process Overview",
    date: "2023-03-22T14:15:00Z",
    user: "Michael Chen",
  },
  {
    id: "3",
    dataRoomId: "2",
    type: "document_added",
    documentName: "ESG Integration Methodology",
    date: "2023-05-10T09:45:00Z",
    user: "Emily Rodriguez",
  },
  {
    id: "4",
    dataRoomId: "3",
    type: "folder_added",
    folderName: "Risk Management",
    date: "2023-02-18T16:20:00Z",
    user: "David Wilson",
  },
  {
    id: "5",
    dataRoomId: "4",
    type: "document_updated",
    documentName: "Team Biographies",
    date: "2023-01-30T11:10:00Z",
    user: "James Thompson",
  },
  {
    id: "6",
    dataRoomId: "5",
    type: "document_added",
    documentName: "Historical Holdings Analysis",
    date: "2023-04-28T15:30:00Z",
    user: "Sarah Johnson",
  },
  {
    id: "7",
    dataRoomId: "1",
    type: "document_added",
    documentName: "Due Diligence Questionnaire",
    date: "2023-03-15T13:45:00Z",
    user: "Michael Chen",
  },
  {
    id: "8",
    dataRoomId: "1",
    type: "document_viewed",
    documentName: "Investment Process Overview",
    date: "2023-04-16T09:30:00Z",
    user: "Jennifer Liu",
    viewerDetails: "Viewed for 15 minutes",
  },
  {
    id: "9",
    dataRoomId: "1",
    type: "document_downloaded",
    documentName: "Q1 2023 Strategy Update",
    date: "2023-04-16T11:45:00Z",
    user: "Robert Kim",
    downloadDetails: "Downloaded PDF version",
  },
]

export function DocumentUpdates({ dataRoomId }: DocumentUpdatesProps) {
  const { data: session } = useSession()
  const userRole = session?.user?.role || "allocator"

  // Filter updates for the current data room
  let filteredUpdates = updates.filter((update) => update.dataRoomId === dataRoomId)

  // For allocators, only show document/folder additions and updates - hide viewing/download activity
  if (userRole === "allocator") {
    filteredUpdates = filteredUpdates.filter(
      (update) =>
        update.type === "document_added" || update.type === "document_updated" || update.type === "folder_added",
    )
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document_viewed":
        return <Eye className="h-4 w-4 text-purple-600" />
      case "document_downloaded":
        return <FileText className="h-4 w-4 text-orange-600" />
      case "document_added":
      case "document_updated":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "folder_added":
        return <FolderOpen className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4 text-blue-600" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "document_viewed":
        return "bg-purple-100"
      case "document_downloaded":
        return "bg-orange-100"
      case "document_added":
      case "document_updated":
        return "bg-blue-100"
      case "folder_added":
        return "bg-green-100"
      default:
        return "bg-blue-100"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredUpdates.length > 0 ? (
          <div className="space-y-4">
            {filteredUpdates.map((update) => (
              <div key={update.id} className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <div
                    className={`h-8 w-8 rounded-full ${getActivityColor(update.type)} flex items-center justify-center`}
                  >
                    {getActivityIcon(update.type)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {update.type === "document_added"
                      ? `New document added: ${update.documentName}`
                      : update.type === "document_updated"
                        ? `Document updated: ${update.documentName}`
                        : update.type === "folder_added"
                          ? `New folder added: ${update.folderName}`
                          : update.type === "document_viewed"
                            ? `Document viewed: ${update.documentName}`
                            : update.type === "document_downloaded"
                              ? `Document downloaded: ${update.documentName}`
                              : `Activity on: ${update.documentName || update.folderName}`}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(update.date)}</span>
                    <span>•</span>
                    <span>{update.user}</span>
                    {/* Show additional details only for managers */}
                    {userRole === "manager" && (update.viewerDetails || update.downloadDetails) && (
                      <>
                        <span>•</span>
                        <span>{update.viewerDetails || update.downloadDetails}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent updates for this data room.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
