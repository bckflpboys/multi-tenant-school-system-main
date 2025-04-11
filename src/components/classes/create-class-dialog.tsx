"use client"

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

export function CreateClassDialog() {
  const onSubmit = async (data: ClassFormValues) => {
    // TODO: Implement class creation logic
    console.log(data)
  }

  return (
    <Dialog>
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
          <ClassForm onSubmit={onSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
