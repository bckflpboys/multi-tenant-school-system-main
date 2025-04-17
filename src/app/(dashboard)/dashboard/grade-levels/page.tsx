import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CreateGradeLevelDialog } from "@/components/grade-levels/create-grade-level-dialog"
import { GradeLevelsList } from "@/components/grade-levels/grade-levels-list"

export const metadata: Metadata = {
  title: "Grade Levels",
  description: "Manage grade levels in your school.",
}

export default async function GradeLevelsPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto py-6 bg-green-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Grade Levels</h1>
          <p className="mt-1 text-gray-500">
            Manage grade levels and their configurations
          </p>
        </div>
        <CreateGradeLevelDialog />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          {session?.user?.schoolId ? (
            <GradeLevelsList schoolId={session.user.schoolId} />
          ) : (
            <p className="text-gray-500">Unable to load grade levels. Please try again later.</p>
          )}
        </div>
      </div>
    </div>
  )
}
