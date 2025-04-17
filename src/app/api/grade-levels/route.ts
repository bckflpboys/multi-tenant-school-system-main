import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { gradeLevelFormSchema } from "@/lib/validations/grade-level"

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
    const validatedData = gradeLevelFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const gradeLevelsCollection = schoolDb.collection('grade-levels')
    
    // Create the grade level
    const newGradeLevel = {
      ...validatedData,
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Insert the grade level into the school's grade-levels collection
    const result = await gradeLevelsCollection.insertOne(newGradeLevel)
    console.log('Created grade level:', result)

    return NextResponse.json(
      { message: 'Grade level created successfully', gradeLevelId: result.insertedId },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating grade level:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating grade level' },
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
    const gradeLevelsCollection = schoolDb.collection('grade-levels')

    // Get all grade levels for the school
    const gradeLevels = await gradeLevelsCollection
      .find({ schoolId })
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json(gradeLevels)

  } catch (error) {
    console.error('Error fetching grade levels:', error)
    return NextResponse.json(
      { error: 'Error fetching grade levels' },
      { status: 500 }
    )
  }
}
