import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import { SignJWT } from "jose"
import type { UserRole } from "@/types/permissions"

// Map user types to roles
const userTypeToRole: Record<string, UserRole> = {
  student: 'student',
  teacher: 'teacher',
  principal: 'school_admin'
}

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  schoolId: z.string(),
  userType: z.enum(['student', 'teacher', 'principal']),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    console.log('Received signin request:', json)

    const body = signinSchema.parse(json)
    console.log('Validated body:', body)

    const client = await clientPromise
    
    // Connect directly to the school's database
    const schoolDb = client.db(`school-${body.schoolId}`)
    const usersCollection = schoolDb.collection('users')

    // Map the userType to the actual role
    const role = userTypeToRole[body.userType]
    console.log('Checking for user with role:', role)

    // Find the user with correct email and role in the school's database
    const user = await usersCollection.findOne({
      email: body.email,
      role: role
    })

    console.log('Found user in school database:', user)

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await compare(body.password, user.password)
    console.log('Password valid:', isValidPassword)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined')
    }

    // Create session token
    const token = await new SignJWT({
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      schoolId: body.schoolId
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET))

    // Create response with cookie
    const response = NextResponse.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        schoolId: body.schoolId
      }
    })

    // Set cookie in the response
    response.cookies.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return response

  } catch (error) {
    console.error("Error in school signin:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      )
    }
    if (error instanceof Error && error.message === 'JWT_SECRET is not defined') {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: "An error occurred during sign in" },
      { status: 500 }
    )
  }
}
