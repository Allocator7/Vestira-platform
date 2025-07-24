"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { SessionProvider as CustomSessionProvider } from "@/context/SessionContext"
import { AppProvider } from "@/context/AppContext"
import { AccessibilityProvider } from "@/components/AccessibilityProvider"
import { InteractionProvider } from "@/components/InteractionProvider"
import { NotificationContainer } from "@/components/NotificationContainer"
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // Mock session to prevent NextAuth from making API calls
  const mockSession = {
    user: { name: "Demo User", email: "demo@vestira.com" },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }

  return (
    <ErrorBoundary>
      <SessionProvider session={mockSession} refetchInterval={0} refetchOnWindowFocus={false}>
        <CustomSessionProvider>
          <AccessibilityProvider>
            <InteractionProvider>
              <AppProvider>
                {children}
                <NotificationContainer />
                <KeyboardShortcuts />
              </AppProvider>
            </InteractionProvider>
          </AccessibilityProvider>
        </CustomSessionProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
