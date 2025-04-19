'use client'

import { useState, useEffect, useCallback } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ReadAnnouncementDialog } from "@/components/announcements/read-announcement-dialog"
import { useSession } from "next-auth/react"
import { Clock, User } from "lucide-react"

interface Announcement {
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
}

interface NotificationButtonProps {
  userId: string
}

export function NotificationButton({ userId }: NotificationButtonProps) {
  const { data: session } = useSession()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false)

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        schoolId: session?.user?.schoolId || "",
      })

      const response = await fetch(`/api/announcements?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error("Failed to fetch announcements")

      const data = await response.json()
      setAnnouncements(data)
    } catch (error) {
      console.error("Error fetching announcements:", error)
    } finally {
      setLoading(false)
    }
  }, [session?.user?.schoolId])

  useEffect(() => {
    if (session?.user?.schoolId) {
      fetchAnnouncements()
    }
  }, [session?.user?.schoolId, fetchAnnouncements])

  const markAsRead = async (announcementId: string) => {
    try {
      const response = await fetch(`/api/announcements/${announcementId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to mark announcement as read')
      }

      setAnnouncements(prev => prev.map(announcement => {
        if (announcement._id === announcementId) {
          return {
            ...announcement,
            readReceipts: {
              ...announcement.readReceipts,
              [userId]: { readAt: new Date().toISOString() }
            }
          }
        }
        return announcement
      }))
    } catch (error) {
      console.error('Error marking announcement as read:', error)
    }
  }

  const handleAnnouncementClick = async (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setAnnouncementDialogOpen(true)
    setDialogOpen(false)
    await markAsRead(announcement._id)
  }

  const getUnreadAnnouncements = () => {
    if (!userId || !announcements) return []
    return announcements.filter(announcement => {
      const readReceipt = announcement.readReceipts?.[userId]
      return !readReceipt
    })
  }

  const unreadAnnouncements = getUnreadAnnouncements()
  const recentAnnouncements = announcements.slice(0, 4)

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-500" />
            {unreadAnnouncements.length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white p-0">
          <DialogHeader className="p-4 border-b border-gray-200">
            <DialogTitle className="text-lg font-semibold text-gray-900">Recent Announcements</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Your latest school announcements and updates
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No announcements</div>
            ) : (
              <div className="space-y-2">
                {recentAnnouncements.map((announcement) => {
                  const isUnread = !announcement.readReceipts?.[userId]
                  const createdAt = new Date(announcement.createdAt)
                  const startDate = new Date(announcement.startDate)
                  const formattedDate = createdAt.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })

                  return (
                    <button
                      key={announcement._id}
                      onClick={() => handleAnnouncementClick(announcement)}
                      className={cn(
                        "w-full text-left p-3 hover:bg-gray-50/80 transition-all border-l-4 border",
                        {
                          'bg-purple-50/80 border-purple-100 border-l-purple-500 hover:border-purple-200 hover:bg-purple-50/90': announcement.type === 'general',
                          'bg-blue-50/80 border-blue-100 border-l-blue-500 hover:border-blue-200 hover:bg-blue-50/90': announcement.type === 'academic',
                          'bg-orange-50/80 border-orange-100 border-l-orange-500 hover:border-orange-200 hover:bg-orange-50/90': announcement.type === 'event',
                          'bg-red-50/80 border-red-100 border-l-red-500 hover:border-red-200 hover:bg-red-50/90': announcement.type === 'emergency',
                        },
                        isUnread && "shadow-sm"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                          "font-medium line-clamp-1",
                          isUnread ? "text-blue-600" : "text-gray-900"
                        )}>
                          {announcement.title}
                        </span>
                        {isUnread && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{announcement.content}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium border",
                          {
                            'bg-red-50 text-red-700 border-red-200': announcement.priority === 'high',
                            'bg-yellow-50 text-yellow-700 border-yellow-200': announcement.priority === 'medium',
                            'bg-green-50 text-green-700 border-green-200': announcement.priority === 'low',
                          }
                        )}>
                          {announcement.priority}
                        </span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium border",
                          {
                            'bg-purple-50 text-purple-700 border-purple-200': announcement.type === 'general',
                            'bg-blue-50 text-blue-700 border-blue-200': announcement.type === 'academic',
                            'bg-orange-50 text-orange-700 border-orange-200': announcement.type === 'event',
                            'bg-red-50 text-red-700 border-red-200': announcement.type === 'emergency',
                          }
                        )}>
                          {announcement.type}
                        </span>
                        {announcement.startDate && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {startDate.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {formattedDate}
                        </span>
                      </div>
                    </button>
                  )
                })}
                {announcements.length > 4 && (
                  <Link
                    href="/dashboard/announcements"
                    className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700 mt-4 py-2 border-t border-gray-100"
                  >
                    View all announcements
                  </Link>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ReadAnnouncementDialog
        announcement={selectedAnnouncement}
        open={announcementDialogOpen}
        onOpenChange={setAnnouncementDialogOpen}
      />
    </>
  )
}
