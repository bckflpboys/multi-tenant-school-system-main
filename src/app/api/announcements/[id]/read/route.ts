import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get announcement ID from URL
    const announcementId = req.nextUrl.pathname.split('/')[3]
    if (!announcementId || !ObjectId.isValid(announcementId)) {
      return NextResponse.json({ error: 'Invalid announcement ID' }, { status: 400 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${session.user.schoolId}`)
    const announcementsCollection = schoolDb.collection('announcements')

    // Find the announcement and update read receipts
    const result = await announcementsCollection.updateOne(
      { _id: new ObjectId(announcementId) },
      {
        $set: {
          [`readReceipts.${session.user.id}`]: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Announcement marked as read' })
  } catch (error) {
    console.error('Error marking announcement as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
