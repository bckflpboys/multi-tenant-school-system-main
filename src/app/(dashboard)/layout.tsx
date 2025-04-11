"use client"

import { MainNav } from "@/components/dashboard/main-nav"
import { SideNav } from "@/components/dashboard/side-nav"
import { UserNav } from "@/components/dashboard/user-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50/95">
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm backdrop-blur-sm bg-white/60 supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between py-4 px-8">
          <div className="flex items-center gap-8">
            <a href="/dashboard" className="flex items-center gap-2 font-semibold text-lg text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              School System
            </a>
            <MainNav />
          </div>
          <UserNav />
        </div>
      </header>
      <div className="flex">
        <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-80 shrink-0 border-r border-gray-200 bg-white shadow-[1px_0_0_0_rgba(0,0,0,0.05)] md:sticky">
          <div className="flex h-full flex-col py-6">
            <div className="px-4 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pt-4">
              <SideNav />
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-hidden min-h-[calc(100vh-4rem)] bg-gray-50/50">
          <div className="container py-6 px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
