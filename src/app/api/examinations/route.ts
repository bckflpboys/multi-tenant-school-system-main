import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"

export async function GET(req: Request) {
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

    // Get all examinations for the school
    const examinations = await examinationsCollection
      .find({ status: { $ne: 'deleted' } })
      .sort({ startDate: -1 })
      .toArray()

    return NextResponse.json(examinations)

  } catch (error) {
    console.error('Error fetching examinations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch examinations' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
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
    
    // Create the examination record
    const newExamination = {
      ...body,
      schoolId,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Upcoming'
    }

    // Insert the examination into the school's examinations collection
    const result = await examinationsCollection.insertOne(newExamination)
    console.log('Created examination:', result)

    return NextResponse.json({
      message: 'Examination created successfully',
      examination: {
        id: result.insertedId,
        ...newExamination
      }
    })

  } catch (error) {
    console.error('Error creating examination:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to create examination' },
      { status: 500 }
    )
  }
}
