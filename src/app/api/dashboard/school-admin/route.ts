import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "school_admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const schoolId = session.user.schoolId
    if (!schoolId) {
      return NextResponse.json({ message: "School ID not found for user" }, { status: 400 })
    }

    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)

    const usersCollection = schoolDb.collection("users")
    const classesCollection = schoolDb.collection("classes")
    const announcementsCollection = schoolDb.collection("announcements")

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const totalStudents = await usersCollection.countDocuments({ role: "student" })
    const newStudentsThisMonth = await usersCollection.countDocuments({ role: "student", createdAt: { $gte: oneMonthAgo } })

    const totalTeachers = await usersCollection.countDocuments({ role: "teacher" })
    const newTeachersThisMonth = await usersCollection.countDocuments({ role: "teacher", createdAt: { $gte: oneMonthAgo } })

    const totalClasses = await classesCollection.countDocuments({})
    const newClassesThisWeek = await classesCollection.countDocuments({ createdAt: { $gte: oneWeekAgo } })

    const totalAnnouncements = await announcementsCollection.countDocuments({})
    const newAnnouncementsToday = await announcementsCollection.countDocuments({ createdAt: { $gte: startOfToday } })

    return NextResponse.json({
      totalStudents,
      newStudentsThisMonth,
      totalTeachers,
      newTeachersThisMonth,
      totalClasses,
      newClassesThisWeek,
      totalAnnouncements,
      newAnnouncementsToday,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
