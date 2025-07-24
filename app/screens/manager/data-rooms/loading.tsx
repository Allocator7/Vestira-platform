import Screen from "@/components/Screen"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Screen>
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="mt-4 md:mt-0">
              <Skeleton className="h-10 w-40" />
            </div>
          </header>

          {/* Search and filters skeleton */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Skeleton className="h-10 w-full md:w-96" />
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="flex border-b border-gray-200 mb-6">
            <Skeleton className="h-10 w-32 mx-2" />
            <Skeleton className="h-10 w-24 mx-2" />
            <Skeleton className="h-10 w-28 mx-2" />
            <Skeleton className="h-10 w-24 mx-2" />
          </div>

          {/* Data Rooms Grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="vestira-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div>
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="flex justify-between mb-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>

                <div className="flex justify-between mb-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-20" />
                </div>

                <div className="flex justify-between">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity Section skeleton */}
          <div className="mt-10">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4">
              <div className="flex justify-between mb-4">
                <Skeleton className="h-5 w-full max-w-3xl" />
              </div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="py-3 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <div>
                        <Skeleton className="h-5 w-64 mb-1" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-32 rounded-md" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}
