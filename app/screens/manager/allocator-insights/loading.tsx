import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[80px] rounded-md" />
          <Skeleton className="h-8 w-[120px] rounded-md" />
        </div>
        <Skeleton className="h-8 w-[100px] rounded-md" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="rounded-lg border bg-card shadow-sm">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-8 w-[80px]" />
                  <Skeleton className="h-4 w-[180px]" />
                </div>
                <Skeleton className="h-[120px] w-full" />
              </div>
            </div>
          ))}
      </div>
      <Skeleton className="h-[1px] w-full" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-[200px]" />
        <div className="grid gap-6 md:grid-cols-2">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="rounded-lg border bg-card shadow-sm">
                <div className="p-6 space-y-4">
                  <Skeleton className="h-5 w-[180px]" />
                  <div className="flex items-center gap-8">
                    <Skeleton className="h-[200px] w-[200px] rounded-full" />
                    <div className="space-y-3">
                      {Array(4)
                        .fill(null)
                        .map((_, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <Skeleton className="h-3 w-3 rounded-full" />
                            <Skeleton className="h-4 w-[100px]" />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
