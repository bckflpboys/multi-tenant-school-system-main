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
import { SubjectForm } from "./subject-form"
import { type SubjectFormValues } from "@/lib/validations/subject"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CreateSubjectDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const onSubmit = async (data: SubjectFormValues) => {
    if (!session?.user?.schoolId) {
      toast.error("No school ID found")
      return
    }

    try {
      setIsLoading(true)
      console.log('Creating subject with data:', data)

      const response = await fetch(`/api/subjects`, {
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
        throw new Error(error.error || 'Failed to create subject')
      }

      const result = await response.json()
      console.log('Created subject:', result)

      toast.success('Subject created successfully')
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error('Error creating subject:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create subject')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Add a new subject to your school curriculum. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <SubjectForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
