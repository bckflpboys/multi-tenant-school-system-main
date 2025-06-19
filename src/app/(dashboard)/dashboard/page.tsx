"use client"

import { useSession } from "next-auth/react"
import { PrincipalDashboard } from "@/components/dashboard/principal-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <DashboardLoadingSkeleton />
  }

  const role = session?.user?.role

  // Render different dashboards based on the user's role
  if (role === "school_admin") {
    return <PrincipalDashboard />
  } else if (role === "teacher") {
    // return <TeacherDashboard />
    return <div>Teacher Dashboard (Coming Soon)</div>
  } else if (role === "student") {
    // return <StudentDashboard />
    return <div>Student Dashboard (Coming Soon)</div>
  } else if (role === "super_admin") {
    // return <SuperAdminDashboard />
    return <div>Super Admin Dashboard (Coming Soon)</div>
  }

  return <div>Welcome to your dashboard!</div>
}

function DashboardLoadingSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-80" />
        <Skeleton className="col-span-3 h-80" />
      </div>
    </div>
  )
}