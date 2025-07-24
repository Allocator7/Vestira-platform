import { Skeleton } from "@/components/ui/skeleton"
import Screen from "@/components/Screen"

export default function NotificationCenterLoading() {
  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Skeleton className="h-10 w-[250px] mb-2" />
              <Skeleton className="h-5 w-[200px]" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-10 w-[150px]" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>

          <Skeleton className="h-10 w-[400px] mb-6" />

          <Skeleton className="h-[500px] w-full rounded-lg" />

          <div className="mt-6 flex justify-between items-center">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
      </div>
    </Screen>
  )
}
