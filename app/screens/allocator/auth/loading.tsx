import { Screen } from "@/components/Screen"
import { Skeleton } from "@/components/ui/skeleton"

export default function AllocatorAuthLoading() {
  return (
    <Screen>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="border rounded-lg shadow-lg p-6">
            <div className="text-center pb-4">
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />

              <div className="flex justify-center">
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}
