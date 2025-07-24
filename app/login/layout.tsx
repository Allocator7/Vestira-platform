import type React from "react"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gradient-to-br from-canvas-bg to-white">{children}</div>
}
