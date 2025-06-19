'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { BookOpen, Users, CalendarClock, Megaphone, AlertCircle } from 'lucide-react'

interface TeacherDashboardData {
  myClasses: number
  myStudents: number
  upcomingDeadlines: number
  myAnnouncements: number
}

const TeacherDashboard = () => {
  const [data, setData] = useState<TeacherDashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/teacher')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">My Classes</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 p-2 border border-blue-500/20">
            <BookOpen className="h-4 w-4 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{data?.myClasses}</div>
          <p className="text-xs text-muted-foreground">Total classes assigned</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-600">My Students</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-500/10 p-2 border border-green-500/20">
            <Users className="h-4 w-4 text-green-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{data?.myStudents}</div>
          <p className="text-xs text-muted-foreground">Total students in your classes</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-600">Upcoming Deadlines</CardTitle>
          <div className="h-8 w-8 rounded-full bg-purple-500/10 p-2 border border-purple-500/20">
            <CalendarClock className="h-4 w-4 text-purple-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{data?.upcomingDeadlines}</div>
          <p className="text-xs text-muted-foreground">Assignments due this week</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-600">My Announcements</CardTitle>
          <div className="h-8 w-8 rounded-full bg-orange-500/10 p-2 border border-orange-500/20">
            <Megaphone className="h-4 w-4 text-orange-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{data?.myAnnouncements}</div>
          <p className="text-xs text-muted-foreground">Posted in the last 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeacherDashboard
