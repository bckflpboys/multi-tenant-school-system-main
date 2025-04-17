'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaUserGraduate, FaIdCard, FaEnvelope, FaPhone, FaCalendarAlt, FaHome, FaUsers } from 'react-icons/fa'
import { useSession } from "next-auth/react"

interface Student {
  _id: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber?: string
  studentId: string
  grade: string
  class: string
  dateOfBirth: string
  parentName?: string
  parentContact?: string
  createdAt: string
  medicalInfo?: string
}

export function StudentList() {
  const { data: session } = useSession()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (session?.user?.schoolId) {
          const response = await fetch(`/api/students?schoolId=${session.user.schoolId}`)
          if (!response.ok) throw new Error('Failed to fetch students')
          const data = await response.json()
          setStudents(data)
        }
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudents()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <p className="text-gray-500 text-center">No students found. Add your first student to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {students.map((student) => (
        <Card 
          key={student._id} 
          className="bg-gradient-to-br from-blue-100 to-indigo-100 border-[1px] border-gray-200 hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                  <FaUserGraduate className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {student.firstName} {student.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaIdCard className="h-4 w-4 text-blue-500" />
                    ID: {student.studentId}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <FaUsers className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <div className="font-medium">Class Information</div>
                    <div>Grade: {student.grade}</div>
                    <div>Class: {student.class}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2">
                  <FaHome className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <div className="font-medium">Parent/Guardian</div>
                    {student.parentName && (
                      <div>{student.parentName}</div>
                    )}
                    {student.parentContact && (
                      <div className="flex items-center gap-2 mt-1">
                        <FaPhone className="h-4 w-4 text-blue-500" />
                        {student.parentContact}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>

            <CardContent className="py-4 flex flex-col justify-center md:border-l border-blue-200/50">
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                  <span>Enrolled: {new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
                {student.medicalInfo && (
                  <div className="text-gray-700 text-sm mt-2">
                    <span className="font-medium">Medical Info:</span>
                    <p className="mt-1">{student.medicalInfo}</p>
                  </div>
                )}
                {student.email && (
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="h-4 w-4 text-blue-500" />
                    <span>{student.email}</span>
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
