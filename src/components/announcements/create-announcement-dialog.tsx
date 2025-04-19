"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AnnouncementForm } from "./announcement-form"
import type { AnnouncementFormValues } from "@/lib/validations/announcement"

export function CreateAnnouncementDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (data: AnnouncementFormValues) => {
    if (!session?.user?.schoolId) {
      toast.error('No school ID found')
      return
    }

    try {
      setIsLoading(true)
      console.log('Creating announcement with data:', data)

      const requestData = {
        ...data,
        schoolId: session.user.schoolId,
        startDate: new Date().toISOString(),
        targetAudience: ["all"],
      }
      console.log('Sending request with data:', requestData)

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        if (responseData.error) {
          throw new Error(responseData.error)
        } else {
          throw new Error('Failed to create announcement')
        }
      }

      toast.success('Announcement created successfully')
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error('Error creating announcement:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create announcement')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Announcement
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Announcement</DialogTitle>
          <DialogDescription>
            Create a new announcement to share with your school community.
          </DialogDescription>
        </DialogHeader>
        <AnnouncementForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}
