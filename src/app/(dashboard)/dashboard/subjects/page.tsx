import { Metadata } from "next"
import { CreateSubjectDialog } from "@/components/subjects/create-subject-dialog"

export const metadata: Metadata = {
  title: "Subjects",
  description: "Manage subjects and curriculum in your school.",
}

export default function SubjectsPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subjects</h1>
          <p className="text-sm text-gray-500">Manage subjects and curriculum in your school.</p>
        </div>
        <CreateSubjectDialog />
      </div>
      {/* Subjects table will go here */}
    </div>
  )
}
