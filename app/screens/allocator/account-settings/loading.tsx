import { Skeleton } from "@/components/ui/skeleton"
import Screen from "@/components/Screen"

export default function Loading() {
  return (
    <Screen>
      <div className="container py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-6 w-32" />
        </div>

        <Skeleton className="h-12 w-full max-w-3xl mb-6" />

        <div className="space-y-6">
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </Screen>
  )
}
