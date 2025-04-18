"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Calendar, Clock, User } from "lucide-react"

interface ReadAnnouncementDialogProps {
  announcement: {
    _id: string
    title: string
    content: string
    type: "general" | "academic" | "event" | "emergency"
    priority: "low" | "medium" | "high"
    createdAt: string
    createdBy: string
    gradeLevels?: { _id: string; name: string }[]
    subjects?: { _id: string; name: string }[]
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const typeColors = {
  general: "bg-gray-100 text-gray-800",
  academic: "bg-green-100 text-green-800",
  event: "bg-purple-100 text-purple-800",
  emergency: "bg-red-100 text-red-800",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-red-100 text-red-800",
}

export function ReadAnnouncementDialog({
  announcement,
  open,
  onOpenChange,
}: ReadAnnouncementDialogProps) {
  if (!announcement) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
          <DialogTitle className="text-2xl font-semibold">
            {announcement.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-gray-600 mt-1">
            <User className="h-4 w-4 text-amber-500" />
            Posted by: {announcement.createdBy}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Content */}
          <div className="bg-gray-50/50 p-4 rounded-lg text-gray-900">
            <div className="prose prose-amber max-w-none">
              {announcement.content.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {line || <br />}
                </span>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              {/* Date and Time */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-amber-500" />
                {format(new Date(announcement.createdAt), "PPP")}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4 text-amber-500" />
                {format(new Date(announcement.createdAt), "p")}
              </div>
            </div>

            <div className="space-y-2">
              {/* Type and Priority */}
              <Badge className={`${typeColors[announcement.type]}`}>
                {announcement.type}
              </Badge>
              <Badge className={`${priorityColors[announcement.priority]}`}>
                Priority: {announcement.priority}
              </Badge>
            </div>
          </div>

          {/* Grade Levels and Subjects */}
          <div className="space-y-3">
            {announcement.gradeLevels && announcement.gradeLevels.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Grades:</span>
                {announcement.gradeLevels.map((grade) => (
                  <Badge key={grade._id} variant="outline">
                    {grade.name}
                  </Badge>
                ))}
              </div>
            )}
            {announcement.subjects && announcement.subjects.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Subjects:</span>
                {announcement.subjects.map((subject) => (
                  <Badge key={subject._id} variant="outline">
                    {subject.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
