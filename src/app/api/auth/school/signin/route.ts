import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { z } from "zod"
import clientPromise from "@/lib/mongodb"
import { SignJWT } from "jose"
import type { UserRole } from "@/types/permissions"

// Map user types to collections and roles
const userTypeConfig: Record<string, { collection: string, role: UserRole }> = {
  student: { collection: 'students', role: 'student' },
  teacher: { collection: 'teachers', role: 'teacher' },
  staff: { collection: 'staff', role: 'staff' },
  principal: { collection: 'users', role: 'school_admin' }
}

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  schoolId: z.string(),
  userType: z.enum(['student', 'teacher', 'staff', 'principal']),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    console.log('Received signin request:', json)

    const body = signinSchema.parse(json)
    console.log('Validated body:', body)

    const client = await clientPromise
    const schoolDb = client.db(`school-${body.schoolId}`)

    // Get the collection and role based on user type
    const config = userTypeConfig[body.userType]
    console.log('Using config:', config)

    if (!config) {
      return NextResponse.json(
        { message: "Invalid user type" },
        { status: 400 }
      )
    }

    // Use the appropriate collection based on user type
    const collection = schoolDb.collection(config.collection)

    // Find the user with correct email
    // For principal/admin, we also check role. For others, role is implicit by collection
    const query = body.userType === 'principal' 
      ? { email: body.email, role: config.role }
      : { email: body.email }

    const user = await collection.findOne(query)
    console.log('Found user:', user ? 'Yes' : 'No')

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
      role: config.role, // Use the role from config
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
        role: config.role, // Use the role from config
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
    console.error('Signin error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "An error occurred during signin" },
      { status: 500 }
    )
  }
}
