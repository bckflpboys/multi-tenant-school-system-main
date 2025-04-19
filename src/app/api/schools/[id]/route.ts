import { NextRequest, NextResponse } from 'next/server'
import { Types } from "mongoose"
import clientPromise from "@/lib/mongodb"
import { z } from "zod"
import { schoolApiSchema } from "@/lib/validations/school"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Define the school document type with MongoDB types
interface SchoolDoc extends Omit<z.infer<typeof schoolApiSchema>, '_id'> {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the response type
interface SchoolResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    users: number;
    classes: number;
    subjects: number;
  };
}

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

    // Check if user has permission to view this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the database
    const client = await clientPromise
    const systemDb = client.db()
    const schoolsCollection = systemDb.collection<SchoolDoc>('schools')

    // Try to find school by ObjectId
    const school = await schoolsCollection.findOne({
      _id: new Types.ObjectId(schoolId)
    })

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    // Get stats from the school's database
    const schoolDb = client.db(`school-${schoolId}`)

    // Get counts from collections
    const [usersCount, classesCount, subjectsCount] = await Promise.all([
      schoolDb.collection('users').countDocuments(),
      schoolDb.collection('classes').countDocuments(),
      schoolDb.collection('subjects').countDocuments()
    ])

    // Convert MongoDB document to response format
    const response: SchoolResponse = {
      _id: school._id.toString(),
      name: school.name,
      email: school.email,
      phone: school.phone,
      address: school.address,
      createdAt: school.createdAt.toISOString(),
      updatedAt: school.updatedAt.toISOString(),
      stats: {
        users: usersCount,
        classes: classesCount,
        subjects: subjectsCount
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in GET /api/schools/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
