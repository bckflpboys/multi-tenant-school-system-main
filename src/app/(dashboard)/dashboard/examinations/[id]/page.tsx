"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaArrowLeft, FaChalkboardTeacher, FaClipboardList, FaGraduationCap } from "react-icons/fa"
import { Skeleton } from "@/components/ui/skeleton"

interface Examination {
  _id: string
  title: string
  subject: string
  code?: string
  type: string
  description?: string
  gradeLevel: string
  examDate: string
  startTime: string
  endDate: string
  duration: number
  totalMarks: number
  passingMarks: number
  venue: string
  examinerId: string
  supervisors: string[]
  instructions: string
  schoolId: string
  status: string
  createdAt: string
  updatedAt: string
}

interface Class {
  _id: string
  name: string
  gradeLevel: string
  section: string
  schoolId: string
  students: string[]
  teachers: string[]
  subjects: string[]
}

export default function ExaminationDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [examination, setExamination] = useState<Examination | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExaminationDetails = async () => {
      try {
        if (!session?.user?.schoolId || !params.id) return

        // Fetch examination details
        const examResponse = await fetch(`/api/examinations/${params.id}?schoolId=${session.user.schoolId}`)
        if (!examResponse.ok) throw new Error('Failed to fetch examination details')
        const examData = await examResponse.json()
        setExamination(examData)

        // Fetch classes for the grade level
        if (examData.gradeLevel) {
          const classesResponse = await fetch(`/api/classes?schoolId=${session.user.schoolId}&gradeLevel=${examData.gradeLevel}`)
          if (!classesResponse.ok) throw new Error('Failed to fetch classes')
          const classesData = await classesResponse.json()
          setClasses(classesData)
        }
      } catch (error) {
        console.error('Error fetching details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExaminationDetails()
  }, [params.id, session])

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4 "
            onClick={() => router.back()}
          >
            <FaArrowLeft className="mr-2 " /> Back
          </Button>
          <Skeleton className="h-8 w-1/3" />
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    )
  }

  if (!examination) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4 text-blue-900"
            onClick={() => router.back()}
          >
            <FaArrowLeft className="mr-2 text-gray-900" /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Examination Not Found</h1>
        </div>
        <p className="text-gray-500">The examination you&apos;re looking for could not be found.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4 text-gray-500"
          onClick={() => router.back()}
        >
          <FaArrowLeft className="mr-2 text-blue-300" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{examination.title}</h1>
          <p className="mt-1 text-gray-500">
            {examination.subject} • {examination.gradeLevel} • {examination.code}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-[1px] border-gray-200 text-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FaClipboardList className="h-5 w-5 text-blue-600" />
              Examination Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="font-medium text-gray-900">{examination.type}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="font-medium capitalize">{examination.status}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Total Marks</p>
                <p className="font-medium text-gray-900">{examination.totalMarks}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Passing Marks</p>
                <p className="font-medium text-gray-900">{examination.passingMarks}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">{examination.duration} minutes</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Venue</p>
                <p className="font-medium text-gray-900">{examination.venue || 'Not specified'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {new Date(examination.examDate).toLocaleDateString()} 
                  {examination.startTime && ` at ${examination.startTime}`}
                </p>
                {examination.endDate && (
                  <p className="text-sm text-gray-500">
                    Ends: {new Date(examination.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {examination.description && (
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-sm">{examination.description}</p>
                </div>
              </div>
            )}

            {examination.instructions && (
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Instructions</p>
                  <p className="text-sm">{examination.instructions}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FaChalkboardTeacher className="h-5 w-5 text-blue-600" />
              Classes in {examination.gradeLevel}
            </CardTitle>
            <CardDescription className="text-gray-900">
              All classes in this grade level that will take this examination
            </CardDescription>
          </CardHeader>
          <CardContent>
            {classes.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No classes found for this grade level.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {classes.map((classItem) => (
                  <Card key={classItem._id} className="bg-white border border-gray-200 hover:border-blue-500/30 transition-all duration-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <FaGraduationCap className="h-4 w-4 text-blue-600" />
                        {classItem.name}
                      </CardTitle>
                      <CardDescription>
                        Section: {classItem.section}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Students: {classItem.students.length}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                          onClick={() => router.push(`/dashboard/classes/${classItem._id}`)}
                        >
                          View Class
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
