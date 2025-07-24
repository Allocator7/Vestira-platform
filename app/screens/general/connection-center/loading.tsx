import { Skeleton } from "@/components/ui/skeleton"
import Screen from "@/components/Screen"

export default function ConnectionCenterLoading() {
  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Skeleton className="h-10 w-[250px] mb-2" />
              <Skeleton className="h-5 w-[350px]" />
            </div>
            <Skeleton className="h-10 w-[150px] mt-4 md:mt-0" />
          </div>

          <Skeleton className="h-[180px] w-full mb-8" />

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-[180px]" />
          </div>

          <Skeleton className="h-10 w-[400px] mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full" />
              ))}
          </div>
        </div>
      </div>
    </Screen>
  )
}
