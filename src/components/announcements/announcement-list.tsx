"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Circle, CheckCircle2, Bell, Calendar, User, Clock, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReadAnnouncementDialog } from "./read-announcement-dialog"

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

const announcementTypes = [
  { value: "all", label: "All Types" },
  { value: "general", label: "General" },
  { value: "academic", label: "Academic" },
  { value: "event", label: "Event" },
  { value: "emergency", label: "Emergency" },
]

const priorityLevels = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const getReadStatus = (announcement: Announcement, userId: string | undefined) => {
  if (!userId || !announcement.readReceipts) return false;
  return !!announcement.readReceipts[userId];
};

export function AnnouncementList() {
  const { data: session } = useSession()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState<string>("all")
  const [priority, setPriority] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        schoolId: session?.user?.schoolId || "",
      })

      if (type && type !== "all") params.append("type", type)
      if (priority && priority !== "all") params.append("priority", priority)
      if (search) params.append("search", search)

      const response = await fetch(`/api/announcements?${params}`)
      if (!response.ok) throw new Error("Failed to fetch announcements")

      const data = await response.json()
      setAnnouncements(data)
    } catch (error) {
      console.error("Error fetching announcements:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (announcementId: string) => {
    try {
      await fetch(`/api/announcements/${announcementId}/read`, {
        method: 'PUT'
      })
    } catch (error) {
      console.error('Error marking announcement as read:', error)
    }
  }

  const handleReadClick = async (announcement: Announcement) => {
    setSelectedAnnouncement(announcement)
    setDialogOpen(true)
    await markAsRead(announcement._id)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (session?.user?.schoolId) {
      fetchAnnouncements()
    }
  }, [session, type, priority, search])

  useEffect(() => {
    if (announcements.length > 0) {
      // Mark announcements as read when they are viewed
      announcements.forEach(announcement => {
        markAsRead(announcement._id)
      })
    }
  }, [announcements])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <ReadAnnouncementDialog 
        announcement={selectedAnnouncement}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Search announcements..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {announcementTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityLevels.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {announcements.map((announcement) => (
          <Card 
            key={announcement._id} 
            className="bg-gradient-to-br from-amber-50 to-orange-50 border-[1px] border-gray-200 hover:border-amber-500/30 transition-all duration-200 overflow-hidden"
          >
            <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
              <CardHeader className="pb-4 md:border-r border-amber-200/50">
                <div className="flex items-center gap-4">
                  <div className="bg-white bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-3 rounded-xl shadow-sm">
                    <Bell className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {announcement.title}
                      </CardTitle>
                      {getReadStatus(announcement, session?.user?.id) ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" aria-label="Read" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-400" aria-label="Unread" />
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                      <User className="h-4 w-4 text-amber-500" />
                      Posted by: {announcement.createdBy}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="py-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                    <div className="text-gray-900 whitespace-pre-line">
                      {announcement.content.length > 200 ? (
                        <>
                          {announcement.content
                            .substring(0, 200)
                            .split('\n')
                            .map((line, i, arr) => (
                              <span key={i}>
                                {line}
                                {i < arr.length - 1 && <br />}
                              </span>
                            ))}
                          ...
                        </>
                      ) : (
                        <>
                          {announcement.content
                            .split('\n')
                            .map((line, i, arr) => (
                              <span key={i}>
                                {line}
                                {i < arr.length - 1 && <br />}
                              </span>
                            ))}
                        </>
                      )}
                      {announcement.content.length > 200 && (
                        <Button
                          variant="link"
                          className="p-0 h-auto font-normal text-amber-600 hover:text-amber-700"
                          onClick={() => handleReadClick(announcement)}
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Read more
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {announcement.gradeLevels && announcement.gradeLevels.length > 0 && (
                      <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                        <span className="text-sm text-gray-600">Grades:</span>
                        {announcement.gradeLevels.map((grade) => (
                          <Badge key={grade._id} variant="outline" className="bg-white">
                            {grade.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {announcement.subjects && announcement.subjects.length > 0 && (
                      <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                        <span className="text-sm text-gray-600">Subjects:</span>
                        {announcement.subjects.map((subject) => (
                          <Badge key={subject._id} variant="outline" className="bg-white">
                            {subject.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <div className="flex flex-col justify-center gap-4 p-6 md:border-l border-amber-200/50">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    <span className="text-gray-600">
                      {format(new Date(announcement.createdAt), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span className="text-gray-600">
                      {format(new Date(announcement.createdAt), "p")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge 
                      className={`w-full justify-center ${typeColors[announcement.type]}`}
                    >
                      {announcement.type}
                    </Badge>
                    <Badge 
                      className={`w-full justify-center ${priorityColors[announcement.priority]}`}
                    >
                      Priority: {announcement.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No announcements found.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
