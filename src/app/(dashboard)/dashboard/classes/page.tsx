import { Metadata } from "next"
import { CreateClassDialog } from "@/components/classes/create-class-dialog"

export const metadata: Metadata = {
  title: "Classes",
  description: "Manage your school classes",
}

export default function ClassesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Classes</h1>
          <p className="mt-1 text-gray-500">
            Manage and organize your school classes
          </p>
        </div>
        <CreateClassDialog />
      </div>

      {/* TODO: Add class list/table component here */}
      <div className="mt-8">
        <div className="rounded-lg border bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">No classes found</h2>
          <p className="mt-2 text-gray-500">
            Create your first class to get started.
          </p>
        </div>
      </div>
    </div>
  )
}
