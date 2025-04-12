import { Metadata } from "next"
import { CreateSchoolDialog } from "../../../../components/schools/create-school-dialog"
import { SchoolsList } from "@/components/schools/schools-list"

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

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <SchoolsList />
        </div>
      </div>
    </div>
  )
}
