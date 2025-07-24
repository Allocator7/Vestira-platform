import { Skeleton } from "@/components/ui/skeleton"
import Screen from "@/components/Screen"

export default function AllocatorHelpSupportLoading() {
  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          </div>

          <Skeleton className="h-12 w-full mb-8" />

          <div className="mb-8">
            <Skeleton className="h-10 w-full mb-6" />

            <div className="space-y-4 mb-8">
              <Skeleton className="h-6 w-48 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton className="h-6 w-48 mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>

          <Skeleton className="h-96 w-full mb-8" />

          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </Screen>
  )
}
