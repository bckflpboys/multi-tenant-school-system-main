import { Metadata } from "next"
import { CreateStaffDialog } from "@/components/staff/create-staff-dialog"
import { StaffList } from "@/components/staff/staff-list"

export const metadata: Metadata = {
  title: "Staff",
  description: "Manage staff members in your school.",
}

export default function StaffPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Staff</h1>
          <p className="mt-1 text-gray-500">
            Manage and organize your school staff
          </p>
        </div>
        <CreateStaffDialog />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <StaffList />
        </div>
      </div>
    </div>
  )
}
