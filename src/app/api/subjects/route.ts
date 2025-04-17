import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { subjectFormSchema } from "@/lib/validations/subject"

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
    const validatedData = subjectFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const subjectsCollection = schoolDb.collection('subjects')
    
    // Create the subject
    const newSubject = {
      ...validatedData,
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert the subject into the school's subjects collection
    const result = await subjectsCollection.insertOne(newSubject)
    console.log('Created subject:', result)

    return NextResponse.json(
      { message: 'Subject created successfully', subjectId: result.insertedId },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating subject:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating subject' },
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
    const subjectsCollection = schoolDb.collection('subjects')

    // Get all subjects for the school
    const subjects = await subjectsCollection.find().sort({ createdAt: -1 }).toArray()

    return NextResponse.json(subjects)

  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Error fetching subjects' },
      { status: 500 }
    )
  }
}
