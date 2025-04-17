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
import { StaffForm } from "./staff-form"
import { type StaffFormValues } from "@/lib/validations/staff"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CreateStaffDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const onSubmit = async (data: StaffFormValues) => {
    if (!session?.user?.schoolId) {
      toast.error("No school ID found")
      return
    }

    try {
      setIsLoading(true)
      console.log('Creating staff member with data:', data)

      const response = await fetch(`/api/staff`, {
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
        throw new Error(error.error || 'Failed to create staff member')
      }

      const result = await response.json()
      console.log('Created staff member:', result)

      toast.success("Staff member created successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating staff member:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create staff member")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Staff Member
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Add a new staff member to your school. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <StaffForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
