import { Skeleton } from "@/components/ui/skeleton"
import Screen from "@/components/Screen"

export default function DocumentSampleLoading() {
  return (
    <Screen>
      <div className="container mx-auto py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <Skeleton className="h-8 w-[400px] mb-2" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>

          <Skeleton className="h-10 w-full rounded-t-lg" />
          <Skeleton className="h-[70vh] w-full rounded-b-lg" />

          <div className="mt-6">
            <Skeleton className="h-10 w-[300px] mb-4" />
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </Screen>
  )
}
