import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "student") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const schoolId = session.user.schoolId
    const userId = session.user.id

    if (!schoolId || !userId) {
      return NextResponse.json({ message: "School or User ID not found" }, { status: 400 })
    }

    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const studentObjectId = new ObjectId(userId)

    // Collections
    const studentsCollection = schoolDb.collection("students")
    const assignmentsCollection = schoolDb.collection("assignments")
    const gradesCollection = schoolDb.collection("grades")
    const schedulesCollection = schoolDb.collection("schedules")
    const announcementsCollection = schoolDb.collection("announcements")

    // Fetch student data to get grade
    const studentData = await studentsCollection.findOne({ _id: studentObjectId })
    const studentGradeLevelId = studentData?.gradeLevelId

    // Date ranges
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const todayDayOfWeek = now.getDay() // Sunday - 0, Monday - 1, etc.

    // Queries for other cards
    const upcomingAssignments = await assignmentsCollection.countDocuments({
      studentId: studentObjectId,
      dueDate: { $gte: startOfToday, $lte: oneWeekFromNow },
    })

    const recentGrades = await gradesCollection.countDocuments({
      studentId: studentObjectId,
      createdAt: { $gte: oneWeekAgo },
    })

    const classesToday = await schedulesCollection.countDocuments({
      studentId: studentObjectId,
      dayOfWeek: todayDayOfWeek,
    })

    // Build announcement query
    const orConditionsForAnnouncements = [
      { gradeLevelIds: { $in: [null, []] } }, // For announcements not targeted to a specific grade
    ]
    if (studentGradeLevelId) {
      orConditionsForAnnouncements.push({ gradeLevelIds: { $in: [studentGradeLevelId] } })
    }

    const newAnnouncements = await announcementsCollection.countDocuments({
      createdAt: { $gte: oneWeekAgo },
      targetAudience: { $in: ["all", "students"] },
      $or: orConditionsForAnnouncements,
    })

    return NextResponse.json({
      upcomingAssignments,
      recentGrades,
      classesToday,
      newAnnouncements,
    })
  } catch (error) {
    console.error("Error fetching student dashboard data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
