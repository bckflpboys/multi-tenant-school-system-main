import { Metadata } from "next"
import { CreateGradeLevelDialog } from "@/components/grade-levels/create-grade-level-dialog"

export const metadata: Metadata = {
  title: "Grade Levels",
  description: "Manage grade levels in your school.",
}

export default function GradeLevelsPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Grade Levels</h1>
          <p className="text-sm text-gray-500">Manage grade levels and their configurations.</p>
        </div>
        <CreateGradeLevelDialog />
      </div>
      {/* Grade Levels table will go here */}
    </div>
  )
}
