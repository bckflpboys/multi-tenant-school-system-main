'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaBookOpen, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChalkboardTeacher, FaGraduationCap, FaClipboardList, FaFileAlt } from 'react-icons/fa'
import { useSession } from "next-auth/react"

interface Examination {
  _id: string
  title: string
  code: string
  type: 'exam' | 'test' | 'assignment'
  description?: string
  subject: string
  gradeLevel: string
  examDate: string
  startTime: string
  endDate?: string
  duration: number
  totalMarks: number
  passingMarks: number
  venue?: string
  examinerId: string
  supervisors?: string[]
  instructions?: string
  status: string
  createdAt: string
}

export function ExaminationList() {
  const { data: session } = useSession()
  const [examinations, setExaminations] = useState<Examination[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchExaminations = async () => {
      try {
        if (session?.user?.schoolId) {
          const response = await fetch(`/api/examinations?schoolId=${session.user.schoolId}`)
          if (!response.ok) throw new Error('Failed to fetch examinations')
          const data = await response.json()
          setExaminations(data)
        }
      } catch (error) {
        console.error('Error fetching examinations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExaminations()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (examinations.length === 0) {
    return (
      <p className="text-gray-500 text-center">No examinations found. Add your first examination to get started.</p>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in-progress':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <FaBookOpen className="h-6 w-6 text-blue-600" />
      case 'test':
        return <FaClipboardList className="h-6 w-6 text-purple-600" />
      case 'assignment':
        return <FaFileAlt className="h-6 w-6 text-green-600" />
      default:
        return <FaBookOpen className="h-6 w-6 text-blue-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'test':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'assignment':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {examinations.map((exam) => (
        <Card 
          key={exam._id} 
          className="bg-gradient-to-br from-blue-100 to-indigo-100 border-[1px] border-gray-200 hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                  {getTypeIcon(exam.type)}
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {exam.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaGraduationCap className="h-4 w-4 text-blue-500" />
                    Code: {exam.code}
                  </CardDescription>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-md text-sm border ${getTypeColor(exam.type)}`}>
                      {exam.type.charAt(0).toUpperCase() + exam.type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <FaCalendarAlt className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <div className="font-medium">Details</div>
                    <div>Subject: {exam.subject}</div>
                    <div>Grade Level: {exam.gradeLevel}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <FaClock className="h-4 w-4 text-blue-500" />
                      Duration: {exam.duration} minutes
                    </div>
                  </div>
                </div>

                {exam.type !== 'assignment' && exam.venue && (
                  <div className="flex items-start gap-3 p-2">
                    <FaMapMarkerAlt className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="text-gray-900">
                      <div className="font-medium">Venue Information</div>
                      <div>{exam.venue}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <FaChalkboardTeacher className="h-4 w-4 text-blue-500" />
                        Examiner ID: {exam.examinerId}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardContent className="py-4 flex flex-col justify-center md:border-l border-blue-200/50">
              <div className="space-y-2 text-gray-600">
                <div>
                  <span className={`px-2 py-1 rounded-md text-sm border ${getStatusColor(exam.status)}`}>
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="font-medium text-gray-900">Marks</div>
                  <div>Total: {exam.totalMarks}</div>
                  <div>Passing: {exam.passingMarks}</div>
                </div>
                {exam.type === 'assignment' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                      <span>Start: {new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                    {exam.endDate && (
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="h-4 w-4 text-red-500" />
                        <span>Due: {new Date(exam.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                      <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock className="h-4 w-4 text-blue-500" />
                      <span>{exam.startTime}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
