import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function IndustryGroupInboxLoading() {
  return (
    <div className="min-h-screen bg-canvas-bg">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List Skeleton */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Skeleton className="h-3 w-3 rounded-full" />
                          <Skeleton className="h-3 w-3 rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-3 w-full" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Detail Skeleton */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-12 text-center">
                <Skeleton className="h-16 w-16 mx-auto mb-4" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" />
                <Skeleton className="h-4 w-64 mx-auto" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
