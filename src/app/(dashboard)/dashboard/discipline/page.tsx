import { Metadata } from "next"
import { CreateDisciplineDialog } from "@/components/discipline/create-discipline-dialog"

export const metadata: Metadata = {
  title: "Discipline Records",
  description: "Manage student discipline records",
}

export default function DisciplinePage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Discipline Records</h1>
          <p className="mt-1 text-gray-500">
            Manage and track student discipline records and incidents
          </p>
        </div>
        <CreateDisciplineDialog />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          {/* TODO: Add discipline records table/list component */}
          <p className="text-gray-500">No discipline records found. Add your first record to get started.</p>
        </div>
      </div>
    </div>
  )
}
