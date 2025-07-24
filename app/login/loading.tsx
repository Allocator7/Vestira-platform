import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-canvas-bg to-white">
      <LoadingSpinner size="lg" />
    </div>
  )
}
