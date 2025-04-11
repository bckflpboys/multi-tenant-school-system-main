import { Metadata } from "next"
import { CreateParentDialog } from "@/components/parents/create-parent-dialog"

export const metadata: Metadata = {
  title: "Parents",
  description: "Manage parents and guardians in your school.",
}

export default function ParentsPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Parents</h1>
          <p className="text-sm text-gray-500">Manage parents and guardians in your school.</p>
        </div>
        <CreateParentDialog />
      </div>
      {/* Parents table will go here */}
    </div>
  )
}
