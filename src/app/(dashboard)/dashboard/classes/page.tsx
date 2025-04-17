import { Metadata } from "next"
import { CreateClassDialog } from "@/components/classes/create-class-dialog"
import { ClassList } from "@/components/classes/class-list"

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

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <ClassList />
        </div>
      </div>
    </div>
  )
}