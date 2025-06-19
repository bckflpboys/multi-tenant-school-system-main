"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, ClipboardCheck, Calendar, Bell } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface StudentDashboardData {
  upcomingAssignments: number
  recentGrades: number
  classesToday: number
  newAnnouncements: number
}

export function StudentDashboard() {
  const [data, setData] = useState<StudentDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard/student")
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data")
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unknown error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <StudentDashboardSkeleton />
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!data) {
    return <div>No data available.</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Student Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Upcoming Assignments</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 p-2 border border-blue-500/20">
              <Book className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{data.upcomingAssignments}</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Recent Grades</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-500/10 p-2 border border-green-500/20">
              <ClipboardCheck className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{data.recentGrades}</div>
            <p className="text-xs text-muted-foreground">Newly graded</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Class Schedule</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500/10 p-2 border border-purple-500/20">
              <Calendar className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{data.classesToday}</div>
            <p className="text-xs text-muted-foreground">Classes today</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Announcements</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 p-2 border border-orange-500/20">
              <Bell className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{data.newAnnouncements}</div>
            <p className="text-xs text-muted-foreground">New this week</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StudentDashboardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </div>
  )
}
