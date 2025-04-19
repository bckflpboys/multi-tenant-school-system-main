import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

interface Params {
  params: {
    id: string
  }
}

export async function PUT(request: Request, context: Params) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get and validate the announcement ID
    const params = await context.params
    const id = params.id
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid announcement ID' }, { status: 400 })
    }

    // Connect to database and get collection
    const client = await clientPromise
    const schoolDb = client.db(`school-${session.user.schoolId}`)
    const announcementsCollection = schoolDb.collection('announcements')

    // Update the read receipt
    const result = await announcementsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          [`readReceipts.${session.user.id}`]: {
            readAt: new Date()
          }
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking announcement as read:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
