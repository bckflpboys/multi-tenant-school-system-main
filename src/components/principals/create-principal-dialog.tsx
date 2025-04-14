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
import { toast } from "react-hot-toast"

export function CreatePrincipalDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data: PrincipalFormValues) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/principals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create principal')
      }

      toast.success('Principal created successfully')
      setOpen(false)
    } catch (error) {
      console.error('Error creating principal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create principal')
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
            Fill in the principal information below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <PrincipalForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
