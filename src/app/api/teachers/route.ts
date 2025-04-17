import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { teacherFormSchema } from "@/lib/validations/teacher"

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
    const validatedData = teacherFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const teachersCollection = schoolDb.collection('teachers')
    
    // Create the teacher
    const newTeacher = {
      ...validatedData,
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }

    // Insert the teacher into the school's teachers collection
    const result = await teachersCollection.insertOne(newTeacher)
    console.log('Created teacher:', result)

    return NextResponse.json(
      { message: 'Teacher created successfully', teacherId: result.insertedId },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating teacher:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating teacher' },
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
    const teachersCollection = schoolDb.collection('teachers')

    // Get all teachers for the school
    const teachers = await teachersCollection.find().sort({ createdAt: -1 }).toArray()

    return NextResponse.json(teachers)

  } catch (error) {
    console.error('Error fetching teachers:', error)
    return NextResponse.json(
      { error: 'Error fetching teachers' },
      { status: 500 }
    )
  }
}
