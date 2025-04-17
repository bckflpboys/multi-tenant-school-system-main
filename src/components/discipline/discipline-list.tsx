"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { FaExclamationTriangle, FaUser, FaCalendarAlt, FaClipboardList, FaArrowRight } from 'react-icons/fa'

interface DisciplineRecord {
  _id: string
  studentId: string
  incidentDate: string
  incidentType: string
  description: string
  actionTaken: string
  severity: "minor" | "moderate" | "major"
  status: "pending" | "resolved" | "under-review"
  reportedBy: string
  parentNotified: boolean
  notificationDate?: string
  followUpAction?: string
  comments?: string
  createdAt: string
  updatedAt: string
}

interface DisciplineListProps {
  schoolId: string
}

export function DisciplineList({ schoolId }: DisciplineListProps) {
  const [records, setRecords] = useState<DisciplineRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDisciplineRecords = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/discipline?schoolId=${schoolId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch discipline records')
      }
      const data = await response.json()
      setRecords(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDisciplineRecords()
  }, [schoolId])

  const getSeverityColor = (severity: DisciplineRecord['severity']) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800'
      case 'moderate':
        return 'bg-orange-100 text-orange-800'
      case 'major':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: DisciplineRecord['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'under-review':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <p className="text-gray-500 text-center">No discipline records found. Add your first record to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {records.map((record) => (
        <Card 
          key={record._id} 
          className="bg-gradient-to-br from-red-50 to-orange-50 border-[1px] border-gray-200 hover:border-red-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-red-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-red-500/20 to-orange-500/20 p-3 rounded-xl shadow-sm">
                  <FaExclamationTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Incident: {record.incidentType}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaUser className="h-4 w-4 text-red-500" />
                    Student ID: {record.studentId}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <FaClipboardList className="h-5 w-5 text-red-500 mt-1" />
                  <div className="text-gray-900">{record.description}</div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <FaCalendarAlt className="h-5 w-5 text-red-500" />
                  <div className="text-gray-900">
                    {format(new Date(record.incidentDate), 'MMMM d, yyyy')}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 p-2">
                  <Badge className={getSeverityColor(record.severity)}>
                    {record.severity}
                  </Badge>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
              </div>
            </CardContent>

            <div className="flex flex-col justify-center gap-4 p-6 md:border-l border-red-200/50">
              <div className="text-sm text-gray-600">
                Reported by: {record.reportedBy}
              </div>
              <Button 
                variant="default"
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white text-base font-medium px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group flex items-center justify-center gap-2"
                onClick={() => {}}
              >
                <span>View Details</span>
                <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
