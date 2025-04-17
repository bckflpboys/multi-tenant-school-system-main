import { Metadata } from "next"
import { CreateParentDialog } from "@/components/parents/create-parent-dialog"
import { ParentList } from "@/components/parents/parent-list"

export const metadata: Metadata = {
  title: "Parents",
  description: "Manage parents in your school.",
}

export default function ParentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Parents</h1>
          <p className="mt-1 text-gray-500">
            Manage and organize your school parents
          </p>
        </div>
        <CreateParentDialog />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <ParentList />
        </div>
      </div>
    </div>
  )
}
