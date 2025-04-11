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
import { DisciplineForm } from "./discipline-form"
import { Plus } from "lucide-react"
import type { DisciplineFormValues } from "@/lib/validations/discipline"

export function CreateDisciplineDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: DisciplineFormValues) => {
    setIsLoading(true)
    
    try {
      // TODO: Implement discipline record creation logic
      console.log(data)
      setOpen(false)
    } catch (error) {
      console.error(error)
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
