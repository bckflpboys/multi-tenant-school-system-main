import { Metadata } from "next"
import { CreateAnnouncementDialog } from "@/components/announcements/create-announcement-dialog"
import { AnnouncementList } from "@/components/announcements/announcement-list"

export const metadata: Metadata = {
  title: "Announcements",
  description: "Create and manage announcements for your school community.",
}

export default function AnnouncementsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Announcements</h1>
          <p className="mt-1 text-gray-500">
            Create and manage announcements for your school community
          </p>
        </div>
        <CreateAnnouncementDialog />
      </div>

      <AnnouncementList />
    </div>
  )
}
