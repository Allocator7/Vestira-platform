import Screen from "@/components/Screen"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <Screen>
      <div className="min-h-screen p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="vestira-card mb-6">
                <div className="flex justify-between mb-6">
                  <div className="flex space-x-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <Skeleton className="h-10 w-40" />
                </div>

                <div className="flex gap-4 mb-6">
                  <Skeleton className="h-10 flex-grow" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>

                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex justify-between py-4 border-b">
                      <Skeleton className="h-12 w-40" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>

              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}
