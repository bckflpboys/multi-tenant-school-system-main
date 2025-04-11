import { Metadata } from "next"
import { CreateTeacherDialog } from "@/components/teachers/create-teacher-dialog"

export const metadata: Metadata = {
  title: "Teachers",
  description: "Manage teachers in your school.",
}

export default function TeachersPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Teachers</h1>
          <p className="text-sm text-gray-500">Manage teachers in your school.</p>
        </div>
        <CreateTeacherDialog />
      </div>
      {/* Teachers table will go here */}
    </div>
  )
}
