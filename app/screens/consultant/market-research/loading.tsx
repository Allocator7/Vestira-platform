import { Screen } from "@/components/Screen"
import { Skeleton } from "@/components/ui/skeleton"

export default function ConsultantMarketResearchLoading() {
  return (
    <Screen>
      <div className="container py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="mb-6 p-6 border border-gray-200 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-1 bg-white border border-gray-200 rounded-lg p-1">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-8 w-40" />
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-12" />
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-24" />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  )
}
