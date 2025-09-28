'use client'

import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppHeader } from '@/components/layout/AppHeader'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}