import { Metadata } from "next"
import { CreateStaffDialog } from "@/components/staff/create-staff-dialog"

export const metadata: Metadata = {
  title: "Staff",
  description: "Manage non-teaching staff in your school.",
}

export default function StaffPage() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
          <p className="text-sm text-gray-500">Manage non-teaching staff in your school.</p>
        </div>
        <CreateStaffDialog />
      </div>
      {/* Staff table will go here */}
    </div>
  )
}
