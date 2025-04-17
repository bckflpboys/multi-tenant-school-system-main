import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CreateDisciplineDialog } from "@/components/discipline/create-discipline-dialog"
import { DisciplineList } from "@/components/discipline/discipline-list"

export const metadata: Metadata = {
  title: "Discipline Records",
  description: "Manage student discipline records",
}

export default async function DisciplinePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between sm:gap-x-8 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Discipline Records</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage and track student discipline records and incidents
          </p>
        </div>
        <CreateDisciplineDialog />
      </div>

      <div className="mt-6">
        {session?.user?.schoolId ? (
          <DisciplineList schoolId={session.user.schoolId} />
        ) : (
          <p className="text-gray-500">Unable to load discipline records. Please try again later.</p>
        )}
      </div>
    </div>
  )
}
