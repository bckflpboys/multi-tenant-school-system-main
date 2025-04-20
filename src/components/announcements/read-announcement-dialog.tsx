import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Calendar, User, Clock } from "lucide-react"

interface ReadAnnouncementDialogProps {
  announcement: {
    _id: string
    title: string
    content: string
    type: "general" | "academic" | "event" | "emergency"
    targetAudience: string[]
    startDate: string
    endDate?: string
    priority: "low" | "medium" | "high"
    createdAt: string
    createdBy: string
    gradeLevels?: { _id: string; name: string }[]
    subjects?: { _id: string; name: string }[]
    readReceipts?: { [key: string]: { readAt: string } }
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReadAnnouncementDialog({
  announcement,
  open,
  onOpenChange,
}: ReadAnnouncementDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  // If no announcement or session, don't render
  if (!announcement || !session?.user?.id) return null

  const handleMarkAsRead = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/announcements/${announcement._id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to mark announcement as read")
      }

      toast.success("Announcement marked as read")
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      console.error("Error marking announcement as read:", error)
      toast.error("Failed to mark announcement as read")
    } finally {
      setIsLoading(false)
    }
  }

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-red-100 text-red-800",
  }

  const typeColors = {
    general: "bg-gray-100 text-gray-800",
    academic: "bg-green-100 text-green-800",
    event: "bg-purple-100 text-purple-800",
    emergency: "bg-red-100 text-red-800",
  }

  const isRead = announcement.readReceipts?.[session.user.id]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <DialogTitle className="text-xl md:text-2xl font-bold">{announcement.title}</DialogTitle>
            <div className="flex flex-wrap gap-2">
              <Badge className={priorityColors[announcement.priority]}>
                {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
              </Badge>
              <Badge className={typeColors[announcement.type]}>
                {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="space-y-3">
            <DialogDescription>
              Announcement details and metadata
            </DialogDescription>
            <div className="grid gap-3 md:grid-cols-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(new Date(announcement.startDate), "PPP")}
                  {announcement.endDate &&
                    ` - ${format(new Date(announcement.endDate), "PPP")}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Created by {announcement.createdBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Created on {format(new Date(announcement.createdAt), "PPP")}
                </span>
              </div>
              {announcement.gradeLevels && announcement.gradeLevels.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>
                    Grade Levels:{" "}
                    {announcement.gradeLevels.map((gl) => gl.name).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="relative mt-6 space-y-4">
          <div className="absolute -top-3 left-0 right-0 h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <div className="prose prose-sm md:prose-base max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
          </div>
          {!isRead && (
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleMarkAsRead}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  "Marking as read..."
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Mark as Read
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
