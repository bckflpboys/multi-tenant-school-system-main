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
import { Button } from "@/components/ui/button"

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
  status: string
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

// Generate time slots from 7:00 AM to 5:00 PM in 30-minute intervals
const timeSlots = Array.from({ length: 20 }, (_, i) => {
  const hour = Math.floor(i / 2) + 7 // Start from 7 AM
  const minutes = i % 2 === 0 ? '00' : '30'
  return `${hour.toString().padStart(2, '0')}:${minutes}`
})

export function LessonTimetable() {
  const { data: session } = useSession()
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [selectedView, setSelectedView] = useState<"week" | "day">("week")
  const [selectedDay, setSelectedDay] = useState<string>("monday")
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
        setLessons(lessonsData.filter((lesson: Lesson) => lesson.status === 'active'))

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

  const getTimeSlotIndex = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    // Round to nearest 30 minutes
    const roundedMinutes = minutes >= 30 ? 30 : 0
    const timeString = `${hours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`
    return timeSlots.findIndex(slot => slot === timeString)
  }

  const calculateGridRow = (startTime: string) => {
    return getTimeSlotIndex(startTime) + 2 // +2 for header row
  }

  const calculateGridRowSpan = (startTime: string, endTime: string) => {
    const startIndex = getTimeSlotIndex(startTime)
    const endIndex = getTimeSlotIndex(endTime)
    return endIndex - startIndex
  }

  const renderTimetableGrid = (days: string[]) => (
    <div className="relative grid" style={{ 
      gridTemplateColumns: `auto ${days.map(() => '1fr').join(' ')}`,
      gap: '0.5rem'
    }}>
      {/* Header row */}
      <div className="bg-gray-100 font-medium p-2 rounded-md border border-gray-200 text-gray-900">Time</div>
      {days.map((day) => (
        <div key={day} className="bg-gray-100 font-medium p-2 text-center rounded-md border border-gray-200 text-gray-900">
          {day}
        </div>
      ))}

      {/* Time slots */}
      {isLoading ? (
        <div className={`col-span-${days.length + 1} py-8 text-center text-gray-500`}>
          <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
          Loading timetable...
        </div>
      ) : (
        <>
          {/* Time labels */}
          {timeSlots.map((time) => (
            <div key={time} className="p-2 text-sm text-gray-600">
              {time}
            </div>
          ))}

          {/* Empty grid cells */}
          {days.map(day => (
            timeSlots.map((time, i) => (
              <div
                key={`${day}-${time}`}
                className="border border-gray-200 rounded-sm"
                style={{ gridColumn: `${days.indexOf(day) + 2}`, gridRow: i + 2 }}
              />
            ))
          ))}

          {/* Lessons */}
          {lessons.map(lesson => {
            const dayIndex = days.findIndex(d => d.toLowerCase() === lesson.dayOfWeek.toLowerCase())
            if (dayIndex === -1) return null

            const gridRow = calculateGridRow(lesson.startTime)
            const gridRowSpan = calculateGridRowSpan(lesson.startTime, lesson.endTime)

            return (
              <div
                key={lesson._id}
                className="absolute bg-purple-50 border border-purple-200 rounded-md p-2"
                style={{
                  gridColumn: dayIndex + 2,
                  gridRow: `${gridRow} / span ${gridRowSpan}`,
                  inset: '0',
                  margin: '2px'
                }}
              >
                <div className="space-y-1">
                  <div className="font-medium text-black">{subjects[lesson.subjectId]?.code}</div>
                  <div className="text-sm text-gray-600">
                    {teachers[lesson.teacherId]?.firstName} {teachers[lesson.teacherId]?.lastName}
                  </div>
                  {lesson.room && (
                    <div className="text-sm text-gray-500">Room: {lesson.room}</div>
                  )}
                  <div className="text-xs text-gray-400">
                    {lesson.startTime} - {lesson.endTime}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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

        {selectedClass && (
          <div className="flex gap-2">
            <Button
              variant={selectedView === "week" ? "default" : "outline"}
              onClick={() => setSelectedView("week")}
              size="sm"
            >
              Week View
            </Button>
            <Button
              variant={selectedView === "day" ? "default" : "outline"}
              onClick={() => setSelectedView("day")}
              size="sm"
            >
              Day View
            </Button>
          </div>
        )}
      </div>

      {selectedClass && selectedView === "day" && (
        <div className="flex gap-2">
          {daysOfWeek.map((day) => (
            <Button
              key={day}
              variant={selectedDay.toLowerCase() === day.toLowerCase() ? "default" : "outline"}
              onClick={() => setSelectedDay(day.toLowerCase())}
              size="sm"
            >
              {day}
            </Button>
          ))}
        </div>
      )}

      {selectedClass && (
        <Card className="p-4">
          {selectedView === "week" ? (
            renderTimetableGrid(daysOfWeek.slice(0, 5))
          ) : (
            renderTimetableGrid([selectedDay])
          )}
        </Card>
      )}
    </div>
  )
}
