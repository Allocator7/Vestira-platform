import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-canvas-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col space-y-6">
          {/* Header skeleton */}
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Search and filters skeleton */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Skeleton className="h-10 flex-grow" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>

            {/* Saved searches skeleton */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-40 rounded-full" />
              <Skeleton className="h-7 w-36 rounded-full" />
              <Skeleton className="h-7 w-44 rounded-full" />
            </div>
          </div>

          {/* Results header skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-40" />
          </div>

          {/* Results grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Skeleton className="w-10 h-10 rounded-md mr-3" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="w-6 h-6 rounded-full" />
                    </div>

                    <div className="mt-4 space-y-3">
                      {Array(4)
                        .fill(0)
                        .map((_, j) => (
                          <div key={j} className="flex items-center">
                            <Skeleton className="w-4 h-4 mr-2" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1">
                      <Skeleton className="h-6 w-16 rounded" />
                      <Skeleton className="h-6 w-20 rounded" />
                    </div>
                  </div>

                  <div className="border-t px-5 py-3">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center mt-8">
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
      </div>
    </div>
  )
}
