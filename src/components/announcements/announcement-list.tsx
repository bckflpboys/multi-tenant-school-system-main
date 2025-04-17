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

export function AnnouncementList() {
  const { data: session } = useSession()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [type, setType] = useState<string>("all")
  const [priority, setPriority] = useState<string>("all")
  const [search, setSearch] = useState("")

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

  useEffect(() => {
    if (session?.user?.schoolId) {
      fetchAnnouncements()
    }
  }, [session, type, priority, search])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
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
          <Card key={announcement._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{announcement.title}</CardTitle>
                  <CardDescription>
                    Posted on {format(new Date(announcement.createdAt), "PPP")}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={typeColors[announcement.type]}>
                    {announcement.type}
                  </Badge>
                  <Badge className={priorityColors[announcement.priority]}>
                    {announcement.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{announcement.content}</p>
              <div className="mt-4 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {announcement.targetAudience.map((audience) => (
                    <Badge key={audience} variant="outline">
                      {audience}
                    </Badge>
                  ))}
                </div>
                {announcement.gradeLevels && announcement.gradeLevels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Grade Levels:</span>
                    {announcement.gradeLevels.map((grade) => (
                      <Badge key={grade._id} variant="secondary">
                        {grade.name}
                      </Badge>
                    ))}
                  </div>
                )}
                {announcement.subjects && announcement.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500">Subjects:</span>
                    {announcement.subjects.map((subject) => (
                      <Badge key={subject._id} variant="secondary">
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                Valid from: {format(new Date(announcement.startDate), "PPP")}
                {announcement.endDate && (
                  <> until {format(new Date(announcement.endDate), "PPP")}</>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {announcements.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              No announcements found.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
