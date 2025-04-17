import { Metadata } from "next"
import { LessonTimetable } from "@/components/lessons/lesson-timetable"

export const metadata: Metadata = {
  title: "Lesson Timetable",
  description: "View and manage your school's lesson timetable",
}

export default function LessonTimetablePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Lesson Timetable</h2>
      </div>
      <div className="grid gap-4">
        <LessonTimetable />
      </div>
    </div>
  )
}
