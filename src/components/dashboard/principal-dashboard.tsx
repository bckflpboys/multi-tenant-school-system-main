"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/dashboard/overview"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Users, GraduationCap, BookOpen, Bell } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardData {
  totalStudents: number
  newStudentsThisMonth: number
  totalTeachers: number
  newTeachersThisMonth: number
  totalClasses: number
  newClassesThisWeek: number
  totalAnnouncements: number
  newAnnouncementsToday: number
}

export function PrincipalDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard/school-admin")
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
    return <PrincipalDashboardSkeleton />
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!data) {
    return <div>No data available.</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-gray-800">Principal&apos;s Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Students</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 p-2 border border-blue-500/20">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{data.totalStudents}</div>
            <p className="text-xs text-muted-foreground">+{data.newStudentsThisMonth} this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Total Teachers</CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-500/10 p-2 border border-green-500/20">
              <GraduationCap className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{data.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">+{data.newTeachersThisMonth} this month</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Active Classes</CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-500/10 p-2 border border-purple-500/20">
              <BookOpen className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{data.totalClasses}</div>
            <p className="text-xs text-muted-foreground">+{data.newClassesThisWeek} since last week</p>
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
            <div className="text-2xl font-bold text-orange-900">{data.totalAnnouncements}</div>
            <p className="text-xs text-muted-foreground">+{data.newAnnouncementsToday} new today</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              Overview
              <span className="text-sm font-normal text-gray-500">Last 6 months</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-white border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center justify-between">
              Recent Activity
              <span className="text-sm font-normal text-blue-500 hover:text-blue-600 cursor-pointer">View all</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PrincipalDashboardSkeleton() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 animate-pulse">
      <div className="flex items-center justify-between space-y-2">
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-80 rounded-lg" />
        <Skeleton className="col-span-3 h-80 rounded-lg" />
      </div>
    </div>
  )
}

