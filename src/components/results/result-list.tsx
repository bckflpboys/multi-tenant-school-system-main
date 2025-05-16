'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { FaGraduationCap, FaBook, FaCalendarAlt, FaClock, FaChalkboardTeacher, FaClipboardList } from 'react-icons/fa'
import { ResultActions } from './result-actions'


interface Examination {
  _id: string
  title: string
  subject: string
  code?: string
  type: "Exam" | "Test" | "Assignment" | "Quiz"
  description?: string
  startDate: string
  endDate: string
  duration: number // in minutes
  totalMarks: number
  class: string
  term: string
  academicYear: string
  createdBy: string
  status: "Upcoming" | "Ongoing" | "Completed"
}

export function ResultList() {
  const { data: session } = useSession()
  const [examinations, setExaminations] = useState<Examination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')

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
      <div className="text-center py-8">
        <p className="text-gray-500">No examinations found.</p>
      </div>
    )
  }

  const filteredExaminations = selectedType === 'all' 
    ? examinations 
    : examinations.filter(exam => exam.type.toLowerCase() === selectedType)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800'
      case 'Ongoing':
        return 'bg-green-100 text-green-800'
      case 'Completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 pb-4 border-b">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedType === 'all' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-gray-600 hover:bg-gray-100'}`}
        >
          All ({examinations.length})
        </button>
        <button
          onClick={() => setSelectedType('exam')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedType === 'exam' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Exams ({examinations.filter(e => e.type === 'Exam').length})
        </button>
        <button
          onClick={() => setSelectedType('test')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedType === 'test' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Tests ({examinations.filter(e => e.type === 'Test').length})
        </button>
        <button
          onClick={() => setSelectedType('assignment')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedType === 'assignment' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Assignments ({examinations.filter(e => e.type === 'Assignment').length})
        </button>
        <button
          onClick={() => setSelectedType('quiz')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedType === 'quiz' 
              ? 'bg-primary text-primary-foreground' 
              : 'text-gray-600 hover:bg-gray-100'}`}
        >
          Quizzes ({examinations.filter(e => e.type === 'Quiz').length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredExaminations.map((examination) => (
          <Card 
            key={examination._id}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-[1px] border-gray-200 hover:border-blue-500/30 transition-all duration-200"
          >
            <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
              <CardHeader className="pb-4 md:border-r border-blue-200/50">
                <div className="flex items-center gap-4">
                  <div className="bg-white bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                    <FaClipboardList className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {examination.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                      <FaBook className="h-4 w-4 text-blue-500" />
                      {examination.subject} - {examination.class}
                    </CardDescription>
                    {examination.code && (
                      <div className="text-blue-600 font-medium text-sm mt-1 flex items-center">
                        <span className="ml-6">Code: {examination.code}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="py-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                    <FaGraduationCap className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="text-gray-900">
                      <div className="font-medium">Examination Details</div>
                      <div>Type: {examination.type}</div>

                      <div>Total Marks: {examination.totalMarks}</div>
                      <div>Duration: {examination.duration} minutes</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-2">
                    <FaCalendarAlt className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="text-gray-900">
                      <div className="font-medium">Schedule</div>
                      <div>Start: {new Date(examination.startDate).toLocaleDateString()}</div>
                      <div>End: {new Date(examination.endDate).toLocaleDateString()}</div>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(examination.status)}`}>
                          {examination.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardContent className="py-4 flex flex-col justify-center md:border-l border-blue-200/50">
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaChalkboardTeacher className="h-4 w-4 text-blue-500" />
                    <span>Term: {examination.term}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="h-4 w-4 text-blue-500" />
                    <span>Academic Year: {examination.academicYear}</span>
                  </div>
                  {examination.description && (
                    <div className="text-gray-700 text-sm mt-2">
                      <span className="font-medium">Description:</span>
                      <p className="mt-1">{examination.description}</p>
                    </div>
                  )}
                  <div className="pt-2">
                    <ResultActions examination={examination} onDelete={() => {
                      setExaminations(examinations.filter(e => e._id !== examination._id))
                    }} />
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
