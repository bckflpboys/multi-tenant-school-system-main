"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
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
import { GradeLevelForm } from "./grade-level-form"
import type { GradeLevelFormValues } from "@/lib/validations/grade-level"

export function CreateGradeLevelDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  async function onSubmit(data: GradeLevelFormValues) {
    if (!session?.user?.schoolId) {
      toast.error("No school ID found")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/grade-levels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          schoolId: session.user.schoolId,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create grade level")
      }

      toast.success("Grade level created successfully")
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Failed to create grade level")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Grade Level
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Grade Level</DialogTitle>
          <DialogDescription>
            Add a new grade level to your school. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <GradeLevelForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
