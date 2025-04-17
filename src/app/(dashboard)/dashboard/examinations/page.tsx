import { Metadata } from "next"
import { CreateExaminationDialog } from "@/components/examinations/create-examination-dialog"
import { ExaminationList } from "@/components/examinations/examination-list"

export const metadata: Metadata = {
  title: "Examinations",
  description: "Manage examinations in your school.",
}

export default function ExaminationsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Examinations</h1>
          <p className="mt-1 text-gray-500">
            Manage and organize your school examinations
          </p>
        </div>
        <CreateExaminationDialog />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <ExaminationList />
        </div>
      </div>
    </div>
  )
}
