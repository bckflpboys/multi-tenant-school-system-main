"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaChalkboardTeacher, FaBook, FaClock, FaMapMarkerAlt, FaUsers, FaArrowRight } from 'react-icons/fa'
import { Badge } from "@/components/ui/badge"

interface Lesson {
  _id: string
  title: string
  description?: string
  subjectId: string
  teacherId: string
  gradeLevelId: string
  startTime: string
  endTime: string
  dayOfWeek: string
  room?: string
  class?: string
  materials?: string[]
  notes?: string
  status: 'active' | 'cancelled' | 'completed'
  createdAt: string
  updatedAt: string
}

interface Class {
  _id: string
  name: string
  grade: string
  academicYear: string
}

interface Subject {
  _id: string
  name: string
  code: string
}

interface Teacher {
  _id: string
  firstName: string
  lastName: string
  email: string
  teacherId: string
}

interface LessonsListProps {
  schoolId: string
}

export function LessonsList({ schoolId }: LessonsListProps) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [lessonsRes, classesRes, subjectsRes, teachersRes] = await Promise.all([
        fetch(`/api/lessons?schoolId=${schoolId}`),
        fetch(`/api/classes?schoolId=${schoolId}`),
        fetch(`/api/subjects?schoolId=${schoolId}`),
        fetch(`/api/teachers?schoolId=${schoolId}`)
      ])

      if (!lessonsRes.ok) throw new Error('Failed to fetch lessons')
      if (!classesRes.ok) throw new Error('Failed to fetch classes')
      if (!subjectsRes.ok) throw new Error('Failed to fetch subjects')
      if (!teachersRes.ok) throw new Error('Failed to fetch teachers')

      const [lessonsData, classesData, subjectsData, teachersData] = await Promise.all([
        lessonsRes.json(),
        classesRes.json(),
        subjectsRes.json(),
        teachersRes.json()
      ])

      setLessons(lessonsData)
      setClasses(classesData)
      setSubjects(subjectsData)
      setTeachers(teachersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [schoolId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getStatusColor = (status: Lesson['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const getClassName = (classId?: string) => {
    if (!classId) return 'Not assigned'
    const classItem = classes.find(c => c._id === classId)
    return classItem ? `${classItem.name} (${classItem.academicYear})` : 'Unknown Class'
  }

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s._id === subjectId)
    return subject ? `${subject.name} (${subject.code})` : 'Unknown Subject'
  }

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t._id === teacherId)
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher'
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

  if (lessons.length === 0) {
    return (
      <p className="text-gray-500 text-center">No lessons found. Add your first lesson to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {lessons.map((lesson) => (
        <Card 
          key={lesson._id} 
          className="bg-gradient-to-br from-purple-50 to-indigo-50 border-[1px] border-gray-200 hover:border-purple-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-purple-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-purple-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                  <FaChalkboardTeacher className="h-6 w-6 text-purple-600" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600">
                    <FaBook className="h-4 w-4 text-purple-500" />
                    {getSubjectName(lesson.subjectId)}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-2 text-gray-600">
                    <FaChalkboardTeacher className="h-4 w-4 text-purple-500" />
                    {getTeacherName(lesson.teacherId)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                {lesson.description && (
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                    <div className="text-gray-900">{lesson.description}</div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-2">
                  <FaClock className="h-5 w-5 text-purple-500" />
                  <div className="text-gray-900">
                    {capitalizeFirstLetter(lesson.dayOfWeek)} • {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
                  </div>
                </div>

                {lesson.room && (
                  <div className="flex items-center gap-3 p-2">
                    <FaMapMarkerAlt className="h-5 w-5 text-purple-500" />
                    <div className="text-gray-900">
                      Room: {lesson.room}
                    </div>
                  </div>
                )}

                {lesson.class && (
                  <div className="flex items-center gap-3 p-2">
                    <FaUsers className="h-5 w-5 text-purple-500" />
                    <div className="text-gray-900">
                      Class: {getClassName(lesson.class)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <div className="flex flex-col justify-center gap-4 p-6 md:border-l border-purple-200/50">
              <Badge className={getStatusColor(lesson.status)}>
                {capitalizeFirstLetter(lesson.status)}
              </Badge>
              <Button 
                variant="default"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-base font-medium px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group flex items-center justify-center gap-2"
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
