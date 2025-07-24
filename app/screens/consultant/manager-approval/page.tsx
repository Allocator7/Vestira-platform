"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function ConsultantManagerApprovalPage() {
  return (
    <div className="container mx-auto px-6 py-8 md:px-8 lg:px-10 max-w-7xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-deep-brand">Manager Approval</h1>
        <p className="text-base text-base-gray">Review and approve manager profiles here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-deep-brand">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base text-base-gray">
            The manager approval workflow will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConsultantManagerApprovalPage
