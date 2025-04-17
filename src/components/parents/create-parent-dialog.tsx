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
import { ParentForm } from "./parent-form"
import { type ParentFormValues } from "@/lib/validations/parent"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CreateParentDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const onSubmit = async (data: ParentFormValues) => {
    if (!session?.user?.schoolId) {
      toast.error("No school ID found")
      return
    }

    try {
      setIsLoading(true)
      console.log('Creating parent with data:', data)

      const response = await fetch(`/api/parents`, {
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
        throw new Error(error.error || 'Failed to create parent')
      }

      const result = await response.json()
      console.log('Created parent:', result)

      toast.success("Parent created successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating parent:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create parent")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Parent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Parent</DialogTitle>
          <DialogDescription>
            Add a new parent to your school. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <ParentForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
