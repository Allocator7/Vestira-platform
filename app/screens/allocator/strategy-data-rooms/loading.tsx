import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-10 w-2/3 mb-2" />
          <Skeleton className="h-5 w-1/2" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <Skeleton className="h-10 w-full md:w-96" />
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
        </div>
      </div>
    </div>
  )
}
