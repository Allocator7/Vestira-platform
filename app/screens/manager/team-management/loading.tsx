import { Skeleton } from "@/components/ui/skeleton"
import Screen from "@/components/Screen"

export default function TeamManagementLoading() {
  return (
    <Screen>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Skeleton className="h-10 w-[250px] mb-2" />
              <Skeleton className="h-5 w-[350px]" />
            </div>
            <Skeleton className="h-10 w-[180px] mt-4 md:mt-0" />
          </div>

          <Skeleton className="h-[180px] w-full mb-8" />

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>

          <Skeleton className="h-10 w-[400px] mb-4" />

          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </Screen>
  )
}
