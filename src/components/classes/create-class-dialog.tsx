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
import { ClassForm } from "./class-form"
import { type ClassFormValues } from "@/lib/validations/class"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CreateClassDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const onSubmit = async (data: ClassFormValues) => {
    if (!session?.user?.schoolId) {
      toast.error("No school ID found")
      return
    }

    try {
      setIsLoading(true)
      console.log('Creating class with data:', data)

      const response = await fetch(`/api/classes`, {
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
        throw new Error(error.error || 'Failed to create class')
      }

      const result = await response.json()
      console.log('Created class:', result)

      toast.success("Class created successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating class:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create class")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl">Create New Class</DialogTitle>
          <DialogDescription className="text-gray-500">
            Add a new class to your school. Fill in the class details below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <ClassForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
