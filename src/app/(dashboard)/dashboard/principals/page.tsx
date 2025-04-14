import { Metadata } from "next"
import { CreatePrincipalDialog } from "@/components/principals/create-principal-dialog"
import { PrincipalsTable } from "@/components/principals/principals-table"

export const metadata: Metadata = {
  title: "Principals",
  description: "Manage school principals",
}

export default function PrincipalsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Principals</h1>
          <p className="mt-1 text-gray-500">
            Manage and assign principals to schools
          </p>
        </div>
        <CreatePrincipalDialog />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="p-6">
          <PrincipalsTable />
        </div>
      </div>
    </div>
  )
}
