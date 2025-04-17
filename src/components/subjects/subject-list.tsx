'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaBook, FaGraduationCap, FaBuilding, FaCalendarAlt } from 'react-icons/fa'
import { useSession } from "next-auth/react"

interface Subject {
  _id: string
  name: string
  code: string
  description: string
  department: string
  gradeLevel: string
  createdAt: string
}

export function SubjectList() {
  const { data: session } = useSession()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        if (session?.user?.schoolId) {
          const response = await fetch(`/api/subjects?schoolId=${session.user.schoolId}`)
          if (!response.ok) throw new Error('Failed to fetch subjects')
          const data = await response.json()
          setSubjects(data)
        }
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubjects()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (subjects.length === 0) {
    return (
      <p className="text-gray-500 text-center">No subjects found. Add your first subject to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {subjects.map((subject) => (
        <Card 
          key={subject._id} 
          className="bg-gradient-to-br from-blue-100 to-indigo-100 border-[1px] border-gray-200 hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                  <FaBook className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {subject.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaGraduationCap className="h-4 w-4 text-blue-500" />
                    {subject.code}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <FaBuilding className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <div className="font-medium">Department</div>
                    <div>{subject.department || 'Not specified'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <FaGraduationCap className="h-5 w-5 text-blue-500" />
                  <div className="text-gray-900">
                    <span className="font-medium mr-2">Grade Level:</span>
                    {subject.gradeLevel}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardContent className="py-4 flex flex-col justify-center md:border-l border-blue-200/50">
              <div className="flex items-center gap-2 text-gray-600">
                <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                <span>Created: {new Date(subject.createdAt).toLocaleDateString()}</span>
              </div>
              {subject.description && (
                <p className="mt-2 text-gray-700 text-sm">
                  {subject.description}
                </p>
              )}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
