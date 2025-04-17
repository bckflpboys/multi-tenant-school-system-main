import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { staffFormSchema } from "@/lib/validations/staff"

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
    const validatedData = staffFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const staffCollection = schoolDb.collection('staff')
    
    // Create the staff member
    const newStaff = {
      ...validatedData,
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }

    // Insert the staff member into the school's staff collection
    const result = await staffCollection.insertOne(newStaff)
    console.log('Created staff member:', result)

    return NextResponse.json(
      { message: 'Staff member created successfully', staffId: result.insertedId },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating staff member:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating staff member' },
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
    const staffCollection = schoolDb.collection('staff')

    // Get all staff members for the school
    const staff = await staffCollection.find().sort({ createdAt: -1 }).toArray()

    return NextResponse.json(staff)

  } catch (error) {
    console.error('Error fetching staff:', error)
    return NextResponse.json(
      { error: 'Error fetching staff' },
      { status: 500 }
    )
  }
}
