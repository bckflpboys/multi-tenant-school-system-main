import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import { Types } from "mongoose"
import { SignJWT } from "jose"
import { cookies } from "next/headers"

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  schoolId: z.string(),
  userType: z.enum(['student', 'teacher', 'principal']),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = signinSchema.parse(json)

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

    // Find the user
    const user = await usersCollection.findOne({
      email: body.email,
      userType: body.userType
    })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await compare(body.password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Create session token
    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      userType: user.userType,
      schoolId: body.schoolId
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    // Set cookie
    cookies().set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType
      }
    })
  } catch (error) {
    console.error("Error in school signin:", error)
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
