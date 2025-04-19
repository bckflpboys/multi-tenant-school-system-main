import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { announcementFormSchema } from "@/lib/validations/announcement"
import { Filter, Document } from "mongodb"

interface GradeLevel {
  _id: ObjectId
  name: string
}

interface Subject {
  _id: ObjectId
  name: string
}

interface Announcement {
  _id: string
  title: string
  content: string
  type: "general" | "academic" | "event" | "emergency"
  targetAudience: ("all" | "students" | "teachers" | "parents" | "staff")[]
  startDate: string
  endDate?: string
  priority: "low" | "medium" | "high"
  attachments?: string[]
  schoolId: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  gradeLevelIds?: string[]
  subjectIds?: string[]
}

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 })
    }

    const body = await req.json()
    console.log('Received request body:', body)
    
    try {
      // Add schoolId to body before validation
      const dataToValidate = {
        ...body,
        schoolId: session.user.schoolId,
      }
      
      // Validate the request body
      const validatedData = announcementFormSchema.parse(dataToValidate)
      console.log('Validated data:', validatedData)

      // Verify user has permission for this school
      if (session.user.schoolId !== validatedData.schoolId && session.user.role !== 'super_admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Get MongoDB client and connect to the school's database
      const client = await clientPromise
      const schoolDb = client.db(`school-${validatedData.schoolId}`)
      const announcementsCollection = schoolDb.collection('announcements')

      // Convert string IDs to ObjectIds for grade levels and subjects
      const gradeLevelObjectIds = validatedData.gradeLevelIds?.map((id: string) => new ObjectId(id)) || []
      const subjectObjectIds = validatedData.subjectIds?.map((id: string) => new ObjectId(id)) || []

      // Create new announcement with ObjectIds
      const newAnnouncement = {
        ...validatedData,
        gradeLevelIds: gradeLevelObjectIds,
        subjectIds: subjectObjectIds,
        createdBy: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        readReceipts: {},
      }

      const result = await announcementsCollection.insertOne(newAnnouncement)

      // If grade levels are specified, fetch their details
      let gradeLevels: GradeLevel[] = []
      if (gradeLevelObjectIds.length > 0) {
        const gradeLevelsCollection = schoolDb.collection<GradeLevel>('grade-levels')
        gradeLevels = await gradeLevelsCollection
          .find({ _id: { $in: gradeLevelObjectIds } })
          .project({ name: 1 })
          .toArray() as GradeLevel[]
      }

      // If subjects are specified, fetch their details
      let subjects: Subject[] = []
      if (subjectObjectIds.length > 0) {
        const subjectsCollection = schoolDb.collection<Subject>('subjects')
        subjects = await subjectsCollection
          .find({ _id: { $in: subjectObjectIds } })
          .project({ name: 1 })
          .toArray() as Subject[]
      }

      // Return the created announcement with grade levels and subjects
      return NextResponse.json({
        message: 'Announcement created successfully',
        id: result.insertedId,
        ...validatedData,
        gradeLevels,
        subjects: subjects.map(subject => ({ _id: subject._id.toString(), name: subject.name })),
      })
    } catch (error) {
      console.error('Validation or database error:', error)
      if (error instanceof ZodError) {
        return NextResponse.json({ 
          error: error.errors[0].message 
        }, { status: 400 })
      }
      throw error
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
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
    const type = searchParams.get('type')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')

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
    const announcementsCollection = schoolDb.collection('announcements')

    // Build filter
    const filter: Filter<Document> = { schoolId } as Filter<Document>

    if (type && type !== "all") {
      filter.type = type as Announcement['type']
    }

    if (priority && priority !== "all") {
      filter.priority = priority as Announcement['priority']
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    // Add audience filter based on user role
    if (session.user.role === 'student') {
      filter.targetAudience = { $in: ['all', 'students'] }
    } else if (session.user.role === 'teacher') {
      filter.targetAudience = { $in: ['all', 'teachers'] }
    } else if (session.user.role === 'parent') {
      filter.targetAudience = { $in: ['all', 'parents'] }
    }

    // Get announcements
    const announcements = await announcementsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    // Fetch grade levels and subjects for each announcement
    const populatedAnnouncements = await Promise.all(
      announcements.map(async (announcement) => {
        let gradeLevels: GradeLevel[] = []
        if (announcement.gradeLevelIds && announcement.gradeLevelIds.length > 0) {
          const gradeLevelsCollection = schoolDb.collection<GradeLevel>('grade-levels')
          gradeLevels = await gradeLevelsCollection
            .find({ _id: { $in: announcement.gradeLevelIds.map((id: string) => new ObjectId(id)) } })
            .project({ name: 1 })
            .toArray() as GradeLevel[]
        }

        let subjects: Subject[] = []
        if (announcement.subjectIds && announcement.subjectIds.length > 0) {
          const subjectsCollection = schoolDb.collection<Subject>('subjects')
          subjects = await subjectsCollection
            .find({ _id: { $in: announcement.subjectIds.map((id: string) => new ObjectId(id)) } })
            .project({ name: 1 })
            .toArray() as Subject[]
        }

        return {
          ...announcement,
          gradeLevels,
          subjects: subjects.map(subject => ({ _id: subject._id.toString(), name: subject.name }))
        }
      })
    )

    return NextResponse.json(populatedAnnouncements)
  } catch (error) {
    console.error('Error in GET /api/announcements:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
