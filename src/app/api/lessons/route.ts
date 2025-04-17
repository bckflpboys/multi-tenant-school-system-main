import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { lessonFormSchema } from "@/lib/validations/lesson"
import { Filter } from "mongodb"

interface Lesson {
  _id: string
  title: string
  description?: string
  subjectId: string
  teacherId: string
  gradeLevelId: string
  startTime: string
  endTime: string
  dayOfWeek: string
  room?: string
  maxStudents?: number
  materials?: string[]
  notes?: string
  status: 'active' | 'cancelled' | 'completed'
  schoolId: string
  createdAt: Date
  updatedAt: Date
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
    
    // Validate the request body
    const validatedData = lessonFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const lessonsCollection = schoolDb.collection('lessons')
    
    // Create the lesson
    const newLesson = {
      ...validatedData,
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }

    // Insert the lesson into the school's lessons collection
    const result = await lessonsCollection.insertOne(newLesson)
    console.log('Created lesson:', result)

    return NextResponse.json(
      { message: 'Lesson created successfully', lessonId: result.insertedId },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating lesson:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating lesson' },
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
    const gradeLevelId = searchParams.get('gradeLevelId')
    const teacherId = searchParams.get('teacherId')

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
    const lessonsCollection = schoolDb.collection<Lesson>('lessons')

    // Build query based on parameters
    const query: Filter<Lesson> = { schoolId }
    if (gradeLevelId) query.gradeLevelId = gradeLevelId
    if (teacherId) query.teacherId = teacherId

    // Get all lessons for the school with optional filters
    const lessons = await lessonsCollection
      .find(query)
      .sort({ dayOfWeek: 1, startTime: 1 })
      .toArray()

    return NextResponse.json(lessons)

  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Error fetching lessons' },
      { status: 500 }
    )
  }
}
