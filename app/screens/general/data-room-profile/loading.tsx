import { Skeleton } from "@/components/ui/skeleton"
import Screen from "@/components/Screen"

export default function DataRoomProfileLoading() {
  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center">
              <Skeleton className="h-14 w-14 rounded-lg mr-4" />
              <div>
                <Skeleton className="h-8 w-[300px] mb-2" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <div className="flex mt-4 md:mt-0 space-x-2">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-[100px] rounded-md" />
              <Skeleton className="h-10 w-[150px] rounded-md" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-[180px] w-full rounded-lg mb-6" />
              <Skeleton className="h-[180px] w-full rounded-lg" />
            </div>
          </div>

          <Skeleton className="h-10 w-[400px] mb-6" />
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </Screen>
  )
}
