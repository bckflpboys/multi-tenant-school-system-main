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
import { DisciplineForm } from "./discipline-form"
import { Plus } from "lucide-react"
import type { DisciplineFormValues } from "@/lib/validations/discipline"

export function CreateDisciplineDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const onSubmit = async (data: DisciplineFormValues) => {
    setIsLoading(true)
    
    try {
      if (!session?.user?.schoolId) {
        throw new Error("School ID not found")
      }

      const response = await fetch("/api/discipline", {
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
        throw new Error(error.error || "Failed to create discipline record")
      }

      toast.success("Discipline record created successfully")
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Failed to create discipline record")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Discipline Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Discipline Record</DialogTitle>
          <DialogDescription>
            Fill in the discipline record information below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <DisciplineForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
