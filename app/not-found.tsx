import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-bg to-white px-4">
      <Card className="w-full max-w-md border-0 shadow-vestira-lg text-center">
        <CardHeader>
          <div className="h-16 w-16 rounded-full bg-electric-blue/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-electric-blue">404</span>
          </div>
          <CardTitle className="text-2xl font-bold text-deep-brand">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base-gray">The page you're looking for doesn't exist or has been moved.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
            <Button asChild className="bg-electric-blue hover:bg-electric-blue/90">
              <Link href="/screens">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
