import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Screen } from "@/components/Screen"

export default function SecuritySettingsLoading() {
  return (
    <Screen title="Security Settings">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />

          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  )
}
