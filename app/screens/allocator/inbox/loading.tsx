import { Skeleton } from "@/components/ui/skeleton"
import { Mail } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="px-4 pt-2">
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-hidden">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-start">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Message detail view */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <Mail className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  )
}
