import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { studentFormSchema } from "@/lib/validations/student"
import bcrypt from "bcryptjs"

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
    const validatedData = studentFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const studentsCollection = schoolDb.collection('students')

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)
    
    // Create the student with role and hashed password
    const newStudent = {
      ...validatedData,
      password: hashedPassword,
      role: 'student',
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }

    // Insert the student into the school's students collection
    const result = await studentsCollection.insertOne(newStudent)
    console.log('Created student:', result)

    // Create a safe response object without the password
    const responseStudent = {
      ...newStudent,
      _id: result.insertedId,
      password: undefined
    }
    delete responseStudent.password

    return NextResponse.json(
      { 
        message: 'Student created successfully', 
        student: responseStudent
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating student:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating student' },
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
    const studentsCollection = schoolDb.collection('students')

    // Get all students for the school, excluding the password field
    const students = await studentsCollection
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(students)

  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { error: 'Error fetching students' },
      { status: 500 }
    )
  }
}
