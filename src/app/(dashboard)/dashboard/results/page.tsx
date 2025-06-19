import { Metadata } from "next"
import { CreateResultDialog } from "@/components/results/create-result-dialog"
import { ResultList } from "@/components/results/result-list"

export const metadata: Metadata = {
  title: "Results",
  description: "View and manage student results.",
}

export default function ResultsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Results</h1>
          <p className="mt-1 text-gray-500">
            View and manage student examination results
          </p>
        </div>
        <CreateResultDialog />
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <ResultList />
        </div>
      </div>
    </div>
  )
}
