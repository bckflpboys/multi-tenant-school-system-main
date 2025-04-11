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
import { ExaminationForm } from "./examination-form"
import type { ExaminationFormValues } from "@/lib/validations/examination"

export function CreateExaminationDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(data: ExaminationFormValues) {
    setIsLoading(true)
    try {
      // TODO: Implement examination creation
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
        <Button>Add Examination</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Examination</DialogTitle>
          <DialogDescription>
            Create a new examination or assessment. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <ExaminationForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
