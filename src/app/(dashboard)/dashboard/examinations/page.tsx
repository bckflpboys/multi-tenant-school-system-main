import { Metadata } from "next"
import { CreateExaminationDialog } from "@/components/examinations/create-examination-dialog"

export const metadata: Metadata = {
  title: "Examinations",
  description: "Manage examinations and assessments in your school.",
}

export default function ExaminationsPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Examinations</h1>
          <p className="text-sm text-gray-500">Manage examinations and assessments in your school.</p>
        </div>
        <CreateExaminationDialog />
      </div>
      {/* Examinations table will go here */}
    </div>
  )
}
