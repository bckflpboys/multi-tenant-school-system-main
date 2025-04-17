import { Metadata } from "next"
import { CreateStudentDialog } from "@/components/students/create-student-dialog"
import { StudentList } from "@/components/students/student-list"

export const metadata: Metadata = {
  title: "Students",
  description: "Manage students in your school.",
}

export default function StudentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Students</h1>
          <p className="mt-1 text-gray-500">
            Manage and organize your school students
          </p>
        </div>
        <CreateStudentDialog />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <StudentList />
        </div>
      </div>
    </div>
  )
}
