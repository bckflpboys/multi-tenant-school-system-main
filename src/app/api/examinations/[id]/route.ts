import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { schoolId } = body

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const examinationsCollection = schoolDb.collection('examinations')

    // Soft delete the examination by updating status to 'deleted'
    const result = await examinationsCollection.updateOne(
      { _id: new ObjectId(context.params.id) },
      { 
        $set: { 
          status: 'deleted',
          deletedAt: new Date(),
          deletedBy: session.user.id
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Examination not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Examination deleted successfully' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
