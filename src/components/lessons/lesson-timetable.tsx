"use client"

import React, { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface Class {
  _id: string
  name: string
  grade: string
  academicYear: string
}

interface GradeLevel {
  _id: string
  name: string
  code: string
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
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [teachers, setTeachers] = useState<{ [key: string]: Teacher }>({})
  const [subjects, setSubjects] = useState<{ [key: string]: Subject }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)
  const timetableRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (!timetableRef.current) return

    const selectedClassItem = classes.find(c => c._id === selectedClass)
    const filename = `timetable-${selectedClassItem?.name || 'class'}-${new Date().toISOString().split('T')[0]}.pdf`

    try {
      // Create a clone of the timetable for PDF generation
      const clone = timetableRef.current.cloneNode(true) as HTMLElement
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      document.body.appendChild(clone)

      // Replace Tailwind classes with inline styles
      const elements = clone.getElementsByTagName('*')
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement
        
        // Remove all Tailwind classes that might use oklch
        el.classList.remove(
          'bg-gray-100', 'text-gray-900', 'text-gray-600', 'text-gray-500', 
          'text-gray-400', 'bg-purple-50', 'border-purple-200'
        )

        // Apply basic styles
        el.style.fontFamily = 'Arial, sans-serif'
        el.style.color = '#000000'
        
        if (el.tagName === 'BUTTON') {
          el.style.backgroundColor = '#ffffff'
          el.style.border = '1px solid #000000'
        }

        // Style time slots and empty cells with light grey borders
        if (el.classList.contains('border-gray-200')) {
          el.style.border = '1px solid #dddddd'
          el.style.backgroundColor = '#ffffff'
        }

        // Style lesson blocks with dark borders
        if (el.classList.contains('absolute')) {
          el.style.backgroundColor = '#ffffff'
          el.style.border = '1.5px solid #000000'
          
          // Find and style the subject code div
          const subjectCodeDiv = el.querySelector('.font-medium')
          if (subjectCodeDiv) {
            subjectCodeDiv.classList.remove('font-medium')
            ;(subjectCodeDiv as HTMLElement).style.fontWeight = '500'
            ;(subjectCodeDiv as HTMLElement).style.border = 'none'
            ;(subjectCodeDiv as HTMLElement).style.backgroundColor = 'transparent'
          }
        }

        // Style headers with dark borders
        if (el.classList.contains('font-medium') && !el.closest('.absolute')) {
          el.style.fontWeight = '500'
          el.style.backgroundColor = '#ffffff'
          el.style.border = '1px solid #000000'
        }
      }

      // Set fixed dimensions for better PDF rendering
      clone.style.width = '1200px'
      clone.style.minHeight = '1600px'
      clone.style.padding = '20px'

      const canvas = await html2canvas(clone, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        removeContainer: true,
        windowWidth: 1200,
        windowHeight: 1600
      })

      // Remove the clone after capturing
      document.body.removeChild(clone)
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1600, 1200] // Custom larger format
      })

      // Calculate dimensions to fit the entire timetable
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Add multiple pages if needed
      const aspectRatio = imgProps.width / imgProps.height
      const totalHeight = pdfWidth / aspectRatio
      const pageCount = Math.ceil(totalHeight / pdfHeight)

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage()
        }

        pdf.addImage(
          imgData,
          'JPEG',
          0,
          -i * pdfHeight, // Offset for each page
          pdfWidth,
          totalHeight
        )
      }

      pdf.save(filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.schoolId) return
      
      try {
        setIsLoadingClasses(true)
        const [classesRes, gradeLevelsRes] = await Promise.all([
          fetch(`/api/classes?schoolId=${session.user.schoolId}`),
          fetch(`/api/grade-levels?schoolId=${session.user.schoolId}`)
        ])

        if (!classesRes.ok) throw new Error('Failed to fetch classes')
        if (!gradeLevelsRes.ok) throw new Error('Failed to fetch grade levels')

        const [classesData, gradeLevelsData] = await Promise.all([
          classesRes.json(),
          gradeLevelsRes.json()
        ])

        setClasses(classesData)
        setGradeLevels(gradeLevelsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoadingClasses(false)
      }
    }

    fetchData()
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

  const getGradeLevelName = (gradeId: string) => {
    const gradeLevel = gradeLevels.find(gl => gl._id === gradeId)
    return gradeLevel ? `${gradeLevel.name} (${gradeLevel.code})` : 'Unknown Grade'
  }

  const renderTimetableGrid = (days: string[]) => (
    <div className="relative grid" style={{ 
      gridTemplateColumns: `auto ${days.map(() => '1fr').join(' ')}`,
      gap: '0.5rem',
      gridAutoRows: 'minmax(80px, auto)'
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
            <div key={time} className="p-2 text-sm text-gray-600 flex items-center">
              {time}
            </div>
          ))}

          {/* Empty grid cells */}
          {days.map(day => (
            timeSlots.map((time, i) => (
              <div
                key={`${day}-${time}`}
                className="border border-gray-200 rounded-sm min-h-[80px]"
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
                className="absolute bg-purple-50 border border-purple-200 rounded-md p-2 overflow-y-auto"
                style={{
                  gridColumn: dayIndex + 2,
                  gridRow: `${gridRow} / span ${gridRowSpan}`,
                  inset: '2px',
                  minHeight: '76px'
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
                  {classItem.name} - {getGradeLevelName(classItem.grade)} ({classItem.academicYear})
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
            <Button
              variant="outline"
              onClick={handleDownload}
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
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
        <Card className="p-4" ref={timetableRef}>
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
