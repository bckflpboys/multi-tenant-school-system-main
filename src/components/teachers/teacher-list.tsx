'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaUserTie, FaEnvelope, FaPhone, FaCalendarAlt, FaBook, FaIdCard } from 'react-icons/fa'
import { useSession } from "next-auth/react"

interface Teacher {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  teacherId: string
  subjects: string[]
  gender: string
  dateOfBirth: string
  createdAt: string
  qualifications?: string
}

export function TeacherList() {
  const { data: session } = useSession()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        if (session?.user?.schoolId) {
          const response = await fetch(`/api/teachers?schoolId=${session.user.schoolId}`)
          if (!response.ok) throw new Error('Failed to fetch teachers')
          const data = await response.json()
          setTeachers(data)
        }
      } catch (error) {
        console.error('Error fetching teachers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeachers()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (teachers.length === 0) {
    return (
      <p className="text-gray-500 text-center">No teachers found. Add your first teacher to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {teachers.map((teacher) => (
        <Card 
          key={teacher._id} 
          className="bg-gradient-to-br from-blue-100 to-indigo-100 border-[1px] border-gray-200 hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                  <FaUserTie className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {teacher.firstName} {teacher.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaIdCard className="h-4 w-4 text-blue-500" />
                    ID: {teacher.teacherId}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <FaEnvelope className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <div className="font-medium">Contact Information</div>
                    <div>{teacher.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <FaPhone className="h-4 w-4 text-blue-500" />
                      {teacher.phoneNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2">
                  <FaBook className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <span className="font-medium">Subjects:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.subjects.map((subject, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-white rounded-md text-sm text-gray-700 border border-gray-200"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardContent className="py-4 flex flex-col justify-center md:border-l border-blue-200/50">
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                  <span>Joined: {new Date(teacher.createdAt).toLocaleDateString()}</span>
                </div>
                {teacher.qualifications && (
                  <div className="text-gray-700 text-sm mt-2">
                    <span className="font-medium">Qualifications:</span>
                    <p className="mt-1">{teacher.qualifications}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
