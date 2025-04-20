"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, FileText } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"

interface Result {
  _id: string
  studentName: string
  subject: string
  examType: string
  score: number
  totalMarks: number
  percentage: number
  grade: string
  term: string
  academicYear: string
  dateRecorded: string
  remarks?: string
  teacherName: string
}

interface ResultActionsProps {
  result: Result
  onDelete: () => void
}

export function ResultActions({ result, onDelete }: ResultActionsProps) {
  const { data: session } = useSession()

  const handleDelete = async () => {
    if (!session?.user?.schoolId) {
      toast.error("No school ID found")
      return
    }

    if (!confirm('Are you sure you want to delete this result?')) {
      return
    }

    try {
      const response = await fetch(`/api/results/${result._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schoolId: session.user.schoolId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to delete result')
      }

      toast.success('Result deleted successfully')
      onDelete()
    } catch (error) {
      console.error('Error deleting result:', error)
      toast.error('Failed to delete result')
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            // TODO: Implement edit functionality
            toast.error('Edit functionality coming soon')
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            // TODO: Implement view details functionality
            toast.error('View details functionality coming soon')
          }}
        >
          <FileText className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
