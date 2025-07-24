"use client"

import { useState } from "react"
import {
  ShieldQuestion,
  Check,
  X,
  Clock,
  User,
  Building,
  FileText,
  MessageSquare,
  Eye,
  Edit,
  Settings,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// Define permission roles and their capabilities
const ROLES = {
  VIEWER: {
    name: "Viewer",
    description: "Can view documents but cannot edit or share",
    icon: Eye,
    color: "bg-brand-lightest text-brand-primary border-brand-lighter",
  },
  CONTRIBUTOR: {
    name: "Contributor",
    description: "Can view and edit documents but cannot manage permissions",
    icon: Edit,
    color: "bg-brand-lightest text-brand-primary border-brand-lighter",
  },
  MANAGER: {
    name: "Manager",
    description: "Full access including permission management",
    icon: Settings,
    color: "bg-brand-lightest text-brand-primary border-brand-lighter",
  },
}

interface AccessRequest {
  id: string
  userId: string
  userName: string
  userEmail: string
  userOrganization: string
  resourceId: string
  resourceName: string
  resourceType: "data-room" | "document" | "ddq"
  requestedRole: keyof typeof ROLES
  message?: string
  status: "pending" | "approved" | "rejected"
  timestamp: string
}

interface AccessRequestManagerProps {
  requests: AccessRequest[]
  onApprove?: (requestId: string, role: keyof typeof ROLES) => Promise<void>
  onReject?: (requestId: string, reason?: string) => Promise<void>
  userRole: "manager" | "allocator"
  className?: string
  onRefresh?: () => Promise<void>
}

export function AccessRequestManager({
  requests,
  onApprove,
  onReject,
  userRole,
  className,
  onRefresh,
}: AccessRequestManagerProps) {
  const [activeTab, setActiveTab] = useState<string>("pending")
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [approvalRole, setApprovalRole] = useState<keyof typeof ROLES>("VIEWER")
  const [rejectionReason, setRejectionReason] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const { toast } = useToast()

  // Check if user can manage access requests
  const canManageRequests = userRole === "manager"

  // Filter requests based on active tab
  const filteredRequests = requests.filter((request) => {
    if (activeTab === "all") return true
    return request.status === activeTab
  })

  // Handle refreshing requests
  const handleRefresh = async () => {
    if (!onRefresh) return

    try {
      setIsRefreshing(true)
      await onRefresh()
      toast({
        title: "Requests refreshed",
        description: "Access requests have been updated",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to refresh requests:", error)
      toast({
        title: "Failed to refresh",
        description: "There was an error refreshing the requests. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Handle approving a request
  const handleApprove = async () => {
    if (!canManageRequests || !selectedRequest) return

    try {
      setIsProcessing(true)
      await onApprove?.(selectedRequest.id, approvalRole)

      toast({
        title: "Request approved",
        description: `Access granted to ${selectedRequest.userName} as ${ROLES[approvalRole].name}`,
        variant: "success",
      })

      setIsApproveDialogOpen(false)
      setSelectedRequest(null)

      // Refresh the requests list if possible
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error("Failed to approve request:", error)
      toast({
        title: "Failed to approve request",
        description: "There was an error processing the approval. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle rejecting a request
  const handleReject = async () => {
    if (!canManageRequests || !selectedRequest) return

    try {
      setIsProcessing(true)
      await onReject?.(selectedRequest.id, rejectionReason)

      toast({
        title: "Request rejected",
        description: `Access request from ${selectedRequest.userName} has been rejected`,
        variant: "success",
      })

      setIsRejectDialogOpen(false)
      setSelectedRequest(null)
      setRejectionReason("")

      // Refresh the requests list if possible
      if (onRefresh) {
        await onRefresh()
      }
    } catch (error) {
      console.error("Failed to reject request:", error)
      toast({
        title: "Failed to reject request",
        description: "There was an error processing the rejection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Open approve dialog
  const openApproveDialog = (request: AccessRequest) => {
    setSelectedRequest(request)
    setApprovalRole(request.requestedRole)
    setIsApproveDialogOpen(true)
  }

  // Open reject dialog
  const openRejectDialog = (request: AccessRequest) => {
    setSelectedRequest(request)
    setRejectionReason("")
    setIsRejectDialogOpen(true)
  }

  // Helper function to render role badge
  const renderRoleBadge = (role: keyof typeof ROLES) => {
    const RoleIcon = ROLES[role].icon
    return (
      <Badge variant="outline" className={ROLES[role].color}>
        <RoleIcon className="h-3 w-3 mr-1" />
        {ROLES[role].name}
      </Badge>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShieldQuestion className="h-5 w-5" />
          Access Requests
        </CardTitle>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label="Refresh access requests"
          >
            {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full">
              <TabsTrigger value="pending" className="flex-1">
                Pending
                <Badge variant="secondary" className="ml-2">
                  {requests.filter((r) => r.status === "pending").length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex-1">
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex-1">
                Rejected
              </TabsTrigger>
              <TabsTrigger value="all" className="flex-1">
                All
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            <div className="divide-y">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className={cn(
                      "p-4 hover:bg-gray-50 transition-colors",
                      request.status === "pending" && "bg-amber-50/30",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <FileText className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant={request.status === "pending" ? "outline" : "secondary"}
                            className={
                              request.status === "pending"
                                ? "bg-brand-lightest text-brand-primary border-brand-lighter"
                                : request.status === "approved"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }
                          >
                            {request.status === "pending"
                              ? "Pending"
                              : request.status === "approved"
                                ? "Approved"
                                : "Rejected"}
                          </Badge>

                          {renderRoleBadge(request.requestedRole)}
                        </div>

                        <h4 className="font-medium text-sm text-deep-brand">
                          Access request for {request.resourceName}
                        </h4>

                        <div className="flex flex-col gap-1 mt-2">
                          <div className="flex items-center text-xs text-base-gray">
                            <User className="h-3 w-3 mr-1" />
                            <span>
                              {request.userName} ({request.userEmail})
                            </span>
                          </div>

                          <div className="flex items-center text-xs text-base-gray">
                            <Building className="h-3 w-3 mr-1" />
                            <span>{request.userOrganization}</span>
                          </div>

                          {request.message && (
                            <div className="flex items-start text-xs text-base-gray mt-1">
                              <MessageSquare className="h-3 w-3 mr-1 mt-0.5" />
                              <span className="line-clamp-2">{request.message}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center text-xs text-base-gray">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{request.timestamp}</span>
                          </div>

                          {canManageRequests && request.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                onClick={() => openApproveDialog(request)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => openRejectDialog(request)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <ShieldQuestion className="h-8 w-8 mx-auto mb-2" />
                  <p>No access requests found</p>
                  {activeTab !== "all" && <p className="text-sm">Try a different filter</p>}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Access Request</DialogTitle>
            <DialogDescription>
              Grant access to {selectedRequest?.resourceName} for {selectedRequest?.userName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-deep-brand">Permission Level</h4>
              <Select value={approvalRole} onValueChange={(value) => setApprovalRole(value as keyof typeof ROLES)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLES).map(([key, role]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <role.icon className="h-4 w-4" />
                        <span>{role.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-2 text-sm text-base-gray">{approvalRole && ROLES[approvalRole].description}</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button
              className="bg-electric-blue text-white hover:bg-electric-blue-shade"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Approve Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Access Request</DialogTitle>
            <DialogDescription>
              Deny access to {selectedRequest?.resourceName} for {selectedRequest?.userName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-700">The user will be notified that their request was rejected.</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-deep-brand">Reason (Optional)</h4>
              <Textarea
                placeholder="Provide a reason for rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Reject Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
