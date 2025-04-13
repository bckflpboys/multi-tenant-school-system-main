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
import { PrincipalForm } from "./principal-form"
import { Plus } from "lucide-react"
import type { PrincipalFormValues } from "@/lib/validations/principal"

export function CreatePrincipalDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: PrincipalFormValues) => {
    setIsLoading(true)
    
    try {
      // TODO: Implement principal creation logic
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
          Add Principal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Principal</DialogTitle>
          <DialogDescription>
            Fill in the principal information below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <PrincipalForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
