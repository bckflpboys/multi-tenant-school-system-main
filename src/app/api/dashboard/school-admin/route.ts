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

    const studentsCollection = schoolDb.collection("students")
    const teachersCollection = schoolDb.collection("teachers")
    const classesCollection = schoolDb.collection("classes")
    const announcementsCollection = schoolDb.collection("announcements")
    const subjectsCollection = schoolDb.collection("subjects")
    const staffCollection = schoolDb.collection("staff")
    const parentsCollection = schoolDb.collection("parents")
    const disciplineCollection = schoolDb.collection("discipline")
    const examinationsCollection = schoolDb.collection("examinations")

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const totalStudents = await studentsCollection.countDocuments({})
    const newStudentsThisMonth = await studentsCollection.countDocuments({ createdAt: { $gte: oneMonthAgo } })

    const totalTeachers = await teachersCollection.countDocuments({})
    const newTeachersThisMonth = await teachersCollection.countDocuments({ createdAt: { $gte: oneMonthAgo } })

    const totalClasses = await classesCollection.countDocuments({})
    const newClassesThisWeek = await classesCollection.countDocuments({ createdAt: { $gte: oneWeekAgo } })

    const totalAnnouncements = await announcementsCollection.countDocuments({})
    const newAnnouncementsToday = await announcementsCollection.countDocuments({ createdAt: { $gte: startOfToday } })

    const totalSubjects = await subjectsCollection.countDocuments({})
    const totalStaff = await staffCollection.countDocuments({})
    const totalParents = await parentsCollection.countDocuments({})
    const totalDiscipline = await disciplineCollection.countDocuments({})
    const totalExaminations = await examinationsCollection.countDocuments({})

    return NextResponse.json({
      totalStudents,
      newStudentsThisMonth,
      totalTeachers,
      newTeachersThisMonth,
      totalClasses,
      newClassesThisWeek,
      totalAnnouncements,
      newAnnouncementsToday,
      totalSubjects,
      totalStaff,
      totalParents,
      totalDiscipline,
      totalExaminations,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
