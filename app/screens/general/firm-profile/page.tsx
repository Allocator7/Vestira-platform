"use client"

import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function FirmProfilePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const managerId = searchParams.get("id")

  // Redirect to the manager-profile page with view=firm parameter
  if (managerId) {
    router.push(`/screens/general/manager-profile?id=${managerId}&view=firm`)
    return <div>Redirecting...</div>
  }

  return (
    <div>
      <h1>Firm Profile</h1>
      <p>No manager ID provided</p>
    </div>
  )
}
