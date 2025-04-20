import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { resultFormSchema } from "@/lib/validations/result"

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
    const validatedData = resultFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const resultsCollection = schoolDb.collection('results')

    // Calculate percentage and grade
    const percentage = (validatedData.score / validatedData.totalMarks) * 100
    const grade = calculateGrade(percentage)
    
    // Create the result record
    const newResult = {
      ...validatedData,
      percentage,
      grade,
      schoolId,
      teacherId: session.user.id,
      teacherName: session.user.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }

    // Insert the result into the school's results collection
    const result = await resultsCollection.insertOne(newResult)
    console.log('Created result:', result)

    return NextResponse.json({
      message: 'Result created successfully',
      result: {
        id: result.insertedId,
        ...newResult
      }
    })

  } catch (error) {
    console.error('Error creating result:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json(
      { error: 'Failed to create result' },
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
    const resultsCollection = schoolDb.collection('results')

    // Get all results for the school
    const results = await resultsCollection
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(results)

  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}

// Helper function to calculate grade
function calculateGrade(percentage: number): string {
  if (percentage >= 97) return "A+"
  if (percentage >= 93) return "A"
  if (percentage >= 90) return "B+"
  if (percentage >= 87) return "B"
  if (percentage >= 83) return "C+"
  if (percentage >= 80) return "C"
  if (percentage >= 77) return "D+"
  if (percentage >= 70) return "D"
  return "F"
}
