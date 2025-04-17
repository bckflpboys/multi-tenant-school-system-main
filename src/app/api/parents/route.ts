import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { parentFormSchema } from "@/lib/validations/parent"

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
    const validatedData = parentFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const parentsCollection = schoolDb.collection('parents')
    
    // Create the parent
    const newParent = {
      ...validatedData,
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    }

    // Insert the parent into the school's parents collection
    const result = await parentsCollection.insertOne(newParent)
    console.log('Created parent:', result)

    return NextResponse.json(
      { message: 'Parent created successfully', parentId: result.insertedId },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating parent:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating parent' },
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
    const parentsCollection = schoolDb.collection('parents')

    // Get all parents for the school
    const parents = await parentsCollection.find().sort({ createdAt: -1 }).toArray()

    return NextResponse.json(parents)

  } catch (error) {
    console.error('Error fetching parents:', error)
    return NextResponse.json(
      { error: 'Error fetching parents' },
      { status: 500 }
    )
  }
}
