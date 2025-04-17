import { Metadata } from "next"
import { CreateSubjectDialog } from "@/components/subjects/create-subject-dialog"
import { SubjectList } from "@/components/subjects/subject-list"

export const metadata: Metadata = {
  title: "Subjects",
  description: "Manage subjects and curriculum in your school.",
}

export default function SubjectsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Subjects</h1>
          <p className="mt-1 text-gray-500">
            Manage subjects and curriculum in your school
          </p>
        </div>
        <CreateSubjectDialog />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <SubjectList />
        </div>
      </div>
    </div>
  )
}
