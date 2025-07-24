import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function HelpSupportLoading() {
  return (
    <div className="container max-w-6xl mx-auto py-10">
      <div className="text-center mb-8">
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="text-center">
                <Skeleton className="h-12 w-12 mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-48 mx-auto" />
              </CardHeader>
              <CardContent className="text-center">
                <Skeleton className="h-6 w-24 mx-auto mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
