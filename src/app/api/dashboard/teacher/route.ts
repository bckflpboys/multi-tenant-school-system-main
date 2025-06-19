import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  try {
    const schoolId = session.user.schoolId
    const teacherId = session.user.id

    if (!schoolId || !teacherId) {
      return NextResponse.json({ message: "School or User ID not found" }, { status: 400 })
    }

    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const teacherObjectId = new ObjectId(teacherId)

    // Collections
    const classesCollection = schoolDb.collection("classes")
    const studentsCollection = schoolDb.collection("students")
    const assignmentsCollection = schoolDb.collection("assignments")
    const announcementsCollection = schoolDb.collection("announcements")

    // 1. Get teacher's classes
    const teacherClasses = await classesCollection.find({ teachers: teacherId }).toArray()
    const myClasses = teacherClasses.length
    const teacherClassIds = teacherClasses.map(c => c._id)

    // 2. Get unique students from those classes
    const myStudents = await studentsCollection.countDocuments({
      classId: { $in: teacherClassIds },
    })

    // 3. Get upcoming deadlines
    const now = new Date()
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const upcomingDeadlines = await assignmentsCollection.countDocuments({
      createdBy: teacherObjectId,
      dueDate: { $gte: now, $lte: oneWeekFromNow },
    })

    // 4. Get teacher's recent announcements
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const myAnnouncements = await announcementsCollection.countDocuments({
      createdBy: teacherObjectId,
      createdAt: { $gte: oneWeekAgo },
    })

    return NextResponse.json({
      myClasses,
      myStudents,
      upcomingDeadlines,
      myAnnouncements,
    })
  } catch (error) {
    console.error("Error fetching teacher dashboard data:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
