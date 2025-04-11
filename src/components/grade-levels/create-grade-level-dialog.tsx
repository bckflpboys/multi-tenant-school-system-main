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
import { GradeLevelForm } from "./grade-level-form"
import type { GradeLevelFormValues } from "@/lib/validations/grade-level"

export function CreateGradeLevelDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(data: GradeLevelFormValues) {
    setIsLoading(true)
    try {
      // TODO: Implement grade level creation
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
        <Button>Add Grade Level</Button>
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
