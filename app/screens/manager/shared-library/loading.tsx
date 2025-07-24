import { Screen } from "@/components/Screen"
import { Skeleton } from "@/components/ui/skeleton"

export default function SharedLibraryLoading() {
  return (
    <Screen>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          {/* Header skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Search and filters skeleton */}
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-10 flex-grow" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Allocator cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <Skeleton className="h-8 w-12 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
          </div>

          {/* Tabs skeleton */}
          <div className="space-y-4">
            <div className="flex gap-2 border-b">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>

            {/* Files grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array(8)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Skeleton className="h-8 w-8" />
                      <div className="flex space-x-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-24 mb-4" />
                    <div className="flex gap-1 mb-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-3 w-32 mt-2" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}
