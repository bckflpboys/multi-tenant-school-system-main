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
import { SchoolForm } from "./school-form"

export function CreateSchoolDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-5 w-5 mr-1.5" />
          Add School
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-900">Add New School</DialogTitle>
          <DialogDescription className="text-gray-600 mt-1">
            Add a new school to the system. Fill in the required information below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <SchoolForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}
