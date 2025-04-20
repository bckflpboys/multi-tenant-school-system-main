import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
  req: Request,
  { params }: { params: { resultId: string } }
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
    const resultsCollection = schoolDb.collection('results')

    // Soft delete the result by updating status to 'deleted'
    const result = await resultsCollection.updateOne(
      { _id: new ObjectId(params.resultId) },
      { 
        $set: { 
          status: 'deleted',
          updatedAt: new Date()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Result not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Result deleted successfully' })

  } catch (error) {
    console.error('Error deleting result:', error)
    return NextResponse.json(
      { error: 'Failed to delete result' },
      { status: 500 }
    )
  }
}
