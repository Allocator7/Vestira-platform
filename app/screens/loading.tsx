import { Skeleton } from "@/components/ui/skeleton"

export default function VestiraScreensLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto mb-2" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        <div className="flex justify-center mb-6">
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(9)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center mb-4">
                  <Skeleton className="h-12 w-12 mr-4" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
