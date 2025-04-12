import { Metadata } from "next"
import { CreateSchoolDialog } from "../../../../components/schools/create-school-dialog"

export const metadata: Metadata = {
  title: "Schools",
  description: "Manage your schools",
}

export default function SchoolsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Schools</h1>
          <p className="mt-1 text-gray-500">
            Manage and view all schools in the system
          </p>
        </div>
        <CreateSchoolDialog />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          {/* TODO: Add school table/list component */}
          <p className="text-gray-500">No schools found. Add your first school to get started.</p>
        </div>
      </div>
    </div>
  )
}
