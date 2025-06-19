import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get schoolId from query params
    const { searchParams } = new URL(req.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const examinationsCollection = schoolDb.collection('examinations')

    // Get examination by ID
    let examinationId
    try {
      examinationId = new ObjectId(params.id)
    } catch {
      return NextResponse.json({ error: 'Invalid examination ID' }, { status: 400 })
    }

    const examination = await examinationsCollection.findOne({ _id: examinationId })

    if (!examination) {
      return NextResponse.json({ error: 'Examination not found' }, { status: 404 })
    }

    return NextResponse.json(examination)

  } catch (error) {
    console.error('Error fetching examination details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch examination details' },
      { status: 500 }
    )
  }
}
