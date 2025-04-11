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
import { DisciplineForm } from "./discipline-form"
import type { DisciplineFormValues } from "@/lib/validations/discipline"
import { useToast } from "@/components/ui/use-toast"

export function CreateDisciplineDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const onSubmit = async (data: DisciplineFormValues) => {
    setIsLoading(true)
    try {
      // TODO: Implement discipline record creation
      console.log(data)
      toast({
        title: "Success",
        description: "Discipline record created successfully",
      })
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to create discipline record",
        variant: "destructive",
      })
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Discipline Record</DialogTitle>
          <DialogDescription>
            Create a new discipline record. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <DisciplineForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
