"use client"

import { MainNav } from "@/components/dashboard/main-nav"
import { SideNav } from "@/components/dashboard/side-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50/95">
      <header className="sticky top-0 z-40 border-b bg-white shadow-sm backdrop-blur-sm bg-white/60 supports-[backdrop-filter]:bg-white/60">
        <MainNav />
      </header>
      <div className="flex">
        <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-72 border-r border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm md:block">
          <div className="flex h-full flex-col py-6">
            <div className="px-4 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pt-4">
              <SideNav />
            </div>
          </div>
        </aside>
        <main className="flex-1 ml-0 md:ml-72 min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto py-6 px-4 md:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
