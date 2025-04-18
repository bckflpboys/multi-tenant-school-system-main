import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get school ID from URL
    const schoolId = req.nextUrl.pathname.split('/')[3]
    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    // Check if user has permission to view classes in this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const classesCollection = schoolDb.collection('classes')

    // Get all classes for the school
    const classes = await classesCollection
      .find({ schoolId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(classes)
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get school ID from URL
    const schoolId = req.nextUrl.pathname.split('/')[3]
    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    // Check if user has permission to create class in this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get request body
    const data = await req.json()
    console.log('Creating class with data:', data)

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const classesCollection = schoolDb.collection('classes')

    // Create new class
    const newClass = {
      name: data.name,
      gradeLevel: data.gradeLevel,
      academicYear: data.academicYear,
      capacity: data.capacity,
      teachers: data.teachers || [],
      schoolId,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await classesCollection.insertOne(newClass)

    console.log('Created class:', { ...newClass, _id: result.insertedId })

    return NextResponse.json(
      { ...newClass, _id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating class:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Invalid class data: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
