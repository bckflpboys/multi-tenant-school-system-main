"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Class {
  _id: string
  name: string
  grade: string
  academicYear: string
}

interface Lesson {
  _id: string
  title: string
  startTime: string
  endTime: string
  dayOfWeek: string
  teacherId: string
  subjectId: string
  gradeLevelId: string
  class: string
  room: string
}

interface Teacher {
  _id: string
  firstName: string
  lastName: string
  teacherId: string
}

interface Subject {
  _id: string
  name: string
  code: string
}

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const timeSlots = Array.from({ length: 14 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8 // Start from 8 AM
  const minutes = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${minutes}`
})

export function LessonTimetable() {
  const { data: session } = useSession()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [classes, setClasses] = useState<Class[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [teachers, setTeachers] = useState<{ [key: string]: Teacher }>({})
  const [subjects, setSubjects] = useState<{ [key: string]: Subject }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      if (!session?.user?.schoolId) return
      
      try {
        setIsLoadingClasses(true)
        const response = await fetch(`/api/classes?schoolId=${session.user.schoolId}`)
        if (!response.ok) throw new Error('Failed to fetch classes')
        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.error('Error fetching classes:', error)
      } finally {
        setIsLoadingClasses(false)
      }
    }

    fetchClasses()
  }, [session?.user?.schoolId])

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.schoolId || !selectedClass) return
      
      setIsLoading(true)
      try {
        // Fetch lessons for the selected class
        const lessonsResponse = await fetch(`/api/lessons?schoolId=${session.user.schoolId}&class=${selectedClass}`)
        if (!lessonsResponse.ok) throw new Error('Failed to fetch lessons')
        const lessonsData = await lessonsResponse.json()
        setLessons(lessonsData)

        // Fetch all teachers
        const teachersResponse = await fetch(`/api/teachers?schoolId=${session.user.schoolId}`)
        if (!teachersResponse.ok) throw new Error('Failed to fetch teachers')
        const teachersData = await teachersResponse.json()
        const teachersMap = teachersData.reduce((acc: { [key: string]: Teacher }, teacher: Teacher) => {
          acc[teacher._id] = teacher
          return acc
        }, {})
        setTeachers(teachersMap)

        // Fetch all subjects
        const subjectsResponse = await fetch(`/api/subjects?schoolId=${session.user.schoolId}`)
        if (!subjectsResponse.ok) throw new Error('Failed to fetch subjects')
        const subjectsData = await subjectsResponse.json()
        const subjectsMap = subjectsData.reduce((acc: { [key: string]: Subject }, subject: Subject) => {
          acc[subject._id] = subject
          return acc
        }, {})
        setSubjects(subjectsMap)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [session?.user?.schoolId, selectedClass])

  const getLessonForTimeSlot = (day: string, time: string) => {
    return lessons.find(lesson => 
      lesson.dayOfWeek.toLowerCase() === day.toLowerCase() && 
      lesson.startTime === time
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Select onValueChange={setSelectedClass} value={selectedClass}>
          <SelectTrigger className="w-[280px]">
            {isLoadingClasses ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading classes...
              </div>
            ) : (
              <SelectValue placeholder="Select a class" />
            )}
          </SelectTrigger>
          <SelectContent>
            {isLoadingClasses ? (
              <SelectItem value="loading" disabled>
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading classes...
                </div>
              </SelectItem>
            ) : classes.length === 0 ? (
              <SelectItem value="none" disabled>No classes found</SelectItem>
            ) : (
              classes.map((classItem) => (
                <SelectItem key={classItem._id} value={classItem._id}>
                  {classItem.name} - <span className="font-bold">Grade {classItem.grade}</span> ({classItem.academicYear})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedClass && (
        <Card className="p-4">
          <div className="grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr] gap-2">
            {/* Header row */}
            <div className="bg-gray-100 font-medium p-2 rounded-md border border-gray-200 text-gray-900">Time</div>
            {daysOfWeek.slice(0, 5).map((day) => (
              <div key={day} className="bg-gray-100 font-medium p-2 text-center rounded-md border border-gray-200 text-gray-900">{day}</div>
            ))}

            {/* Time slots */}
            {isLoading ? (
              <div className="col-span-6 py-8 text-center text-gray-500">
                <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                Loading timetable...
              </div>
            ) : (
              timeSlots.map((time) => (
                <React.Fragment key={time}>
                  <div className="p-2 text-sm text-gray-600">
                    {time}
                  </div>
                  {daysOfWeek.slice(0, 5).map((day) => {
                    const lesson = getLessonForTimeSlot(day, time)
                    return (
                      <div
                        key={`${day}-${time}`}
                        className={`p-2 border rounded-md ${
                          lesson ? 'bg-purple-50 border-purple-200' : 'border-gray-200'
                        }`}
                      >
                        {lesson && (
                          <div className="space-y-1">
                            <div className="font-medium">{subjects[lesson.subjectId]?.name}</div>
                            <div className="text-sm text-gray-600">
                              {teachers[lesson.teacherId]?.firstName} {teachers[lesson.teacherId]?.lastName}
                            </div>
                            {lesson.room && (
                              <div className="text-sm text-gray-500">Room: {lesson.room}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </React.Fragment>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
