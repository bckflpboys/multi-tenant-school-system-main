import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import { Types } from "mongoose"

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  schoolId: z.string(),
  userType: z.enum(['student', 'teacher', 'principal']),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = signupSchema.parse(json)

    const client = await clientPromise
    
    // First verify that the school exists
    const systemDb = client.db('system-db')
    const schoolsCollection = systemDb.collection('schools')
    
    const school = await schoolsCollection.findOne({
      _id: new Types.ObjectId(body.schoolId)
    })

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      )
    }

    // Get the school's database
    const schoolDb = client.db(`school-${body.schoolId}`)
    const usersCollection = schoolDb.collection('users')

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: body.email,
      userType: body.userType
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await hash(body.password, 12)

    // Create the user
    const user = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      userType: body.userType,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await usersCollection.insertOne(user)

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error in school signup:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
