import { LoadingSpinner } from "@/components/LoadingSpinner"

export default function AllocatorActivityLogLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  )
}
