import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { settingsFormSchema } from "@/lib/validations/settings"
import { Filter } from "mongodb"

interface Settings {
  _id: string
  name: string
  address: string
  phone: string
  email: string
  website?: string
  academicYear: string
  timeZone: string
  logo?: string
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
    const validatedData = settingsFormSchema.parse(body)

    // Verify user has permission for this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise
    const schoolDb = client.db(`school-${schoolId}`)
    const settingsCollection = schoolDb.collection('settings')

    // Check if settings already exist
    const existingSettings = await settingsCollection.findOne({ schoolId })
    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await settingsCollection.updateOne(
        { schoolId },
        {
          $set: {
            ...validatedData,
            updatedAt: new Date()
          }
        }
      )
      return NextResponse.json(updatedSettings)
    }

    // Create new settings
    const newSettings = await settingsCollection.insertOne({
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return NextResponse.json(newSettings)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
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
    const settingsCollection = schoolDb.collection('settings')

    // Build filter
    const filter: Filter<Settings> = { schoolId }

    // Get settings
    const settings = await settingsCollection.findOne(filter)

    return NextResponse.json(settings || {})
  } catch (error) {
    console.error('Error in GET /api/settings:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
