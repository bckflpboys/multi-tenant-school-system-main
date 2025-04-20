"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { BookPlus } from "lucide-react"
import { AddBookDialog } from "@/components/library/add-book-dialog"

export default function BooksPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Library Books</h1>
          <p className="text-sm text-gray-500">Manage your library books and resources</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <BookPlus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Search books..."
          className="max-w-sm"
        />
      </div>

      <DataTable columns={columns} data={[]} />

      <AddBookDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  )
}
