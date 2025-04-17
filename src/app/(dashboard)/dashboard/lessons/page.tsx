import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CreateLessonDialog } from "@/components/lessons/create-lesson-dialog"
import { LessonsList } from "@/components/lessons/lessons-list"

export const metadata: Metadata = {
  title: "Lessons",
  description: "Manage lessons and class schedules.",
}

export default async function LessonsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lessons</h1>
          <p className="mt-1 text-gray-500">
            Manage your schools lessons and class schedules
          </p>
        </div>
        <CreateLessonDialog />
      </div>

      <div className="rounded-lg border bg-purple-50/80 text-card-foreground shadow-sm">
        <div className="p-6">
          {session?.user?.schoolId ? (
            <LessonsList schoolId={session.user.schoolId} />
          ) : (
            <p className="text-gray-500">Unable to load lessons. Please try again later.</p>
          )}
        </div>
      </div>
    </div>
  )
}
