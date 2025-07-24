import { Skeleton } from "@/components/ui/skeleton"

export default function AllocatorInsightsLoading() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-12 w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="overflow-hidden rounded-lg border bg-white">
                <Skeleton className="h-40 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6 mb-3" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
        </div>

        <div className="rounded-lg border bg-white">
          <div className="p-6 border-b">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-6 space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}
