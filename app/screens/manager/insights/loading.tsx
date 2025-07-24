import { Screen } from "@/components/Screen"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ManagerInsightsLoading() {
  return (
    <Screen>
      <div className="container py-6 px-4 md:px-6 max-w-7xl">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-6 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search Skeleton */}
        <Skeleton className="h-10 w-full mb-6" />

        {/* Tabs Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-full mb-6" />

          {/* Content Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <Skeleton className="h-4 w-full mb-3" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-12" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Events Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Skeleton className="h-5 w-48 mb-1" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Screen>
  )
}
