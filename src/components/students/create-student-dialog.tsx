"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { StudentForm } from "./student-form"
import { type StudentFormValues } from "@/lib/validations/student"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CreateStudentDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const onSubmit = async (data: StudentFormValues) => {
    if (!session?.user?.schoolId) {
      toast.error("No school ID found")
      return
    }

    try {
      setIsLoading(true)
      console.log('Creating student with data:', data)

      const response = await fetch(`/api/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          schoolId: session.user.schoolId
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create student')
      }

      const result = await response.json()
      console.log('Created student:', result)

      toast.success("Student created successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating student:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create student")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Add a new student to your school. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <StudentForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
