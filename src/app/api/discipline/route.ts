import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { disciplineFormSchema } from "@/lib/validations/discipline"

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { schoolId } = body
    
    // Validate the request body
    const validatedData = disciplineFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const disciplineCollection = schoolDb.collection('discipline')
    
    // Create the discipline record
    const newDisciplineRecord = {
      ...validatedData,
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert the discipline record into the school's discipline collection
    const result = await disciplineCollection.insertOne(newDisciplineRecord)
    console.log('Created discipline record:', result)

    return NextResponse.json(
      { message: 'Discipline record created successfully', disciplineId: result.insertedId },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating discipline record:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating discipline record' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    const disciplineCollection = schoolDb.collection('discipline')

    // Get all discipline records for the school
    const disciplineRecords = await disciplineCollection
      .find({ schoolId })
      .sort({ incidentDate: -1 })
      .toArray()

    return NextResponse.json(disciplineRecords)

  } catch (error) {
    console.error('Error fetching discipline records:', error)
    return NextResponse.json(
      { error: 'Error fetching discipline records' },
      { status: 500 }
    )
  }
}
