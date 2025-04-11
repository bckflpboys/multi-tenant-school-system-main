import { Metadata } from "next"
import { CreateStudentDialog } from "@/components/students/create-student-dialog"

export const metadata: Metadata = {
  title: "Students",
  description: "Manage your students",
}

export default function StudentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Students</h1>
          <p className="mt-1 text-gray-500">
            Manage and view all students in your school
          </p>
        </div>
        <CreateStudentDialog />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          {/* TODO: Add student table/list component */}
          <p className="text-gray-500">No students found. Add your first student to get started.</p>
        </div>
      </div>
    </div>
  )
}
