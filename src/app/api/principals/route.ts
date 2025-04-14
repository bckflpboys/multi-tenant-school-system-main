import { NextResponse } from "next/server"
import { Types } from "mongoose"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { principalFormSchema } from "@/lib/validations/principal"
import bcrypt from "bcryptjs"
import type { UserRole } from "@/types/permissions"

// Define the principal document type
interface PrincipalDoc {
  _id?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  address?: string;
  governmentId?: string;
  employeeId?: string;
  qualifications?: string;
  yearsOfExperience?: string;
  emergencyContact?: string;
  startDate?: string;
  contractDetails?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    const client = await clientPromise
    const systemDb = client.db('system-db')
    
    // First, get all schools
    const schools = await systemDb.collection('schools').find().toArray()
    
    // Then, get principals from each school's users collection
    const principals = []
    
    for (const school of schools) {
      const schoolDb = client.db(`school-${school._id}`)
      const schoolPrincipals = await schoolDb
        .collection<PrincipalDoc>('users')
        .find({ role: 'school_admin' })
        .toArray()
      
      // Add school info to each principal
      const principalsWithSchool = schoolPrincipals.map(principal => ({
        ...principal,
        schoolName: school.name,
        schoolId: school._id
      }))
      
      principals.push(...principalsWithSchool)
    }

    return NextResponse.json({ principals })
  } catch (error) {
    console.error('Error fetching principals:', error)
    return NextResponse.json(
      { error: 'Error fetching principals' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validate the request body
    const validatedData = principalFormSchema.parse(body)
    
    const { 
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      governmentId,
      employeeId,
      qualifications,
      yearsOfExperience,
      emergencyContact,
      assignedSchool, // This is the school ID
      startDate,
      contractDetails
    } = validatedData

    // Get MongoDB client
    const client = await clientPromise
    const schoolDb = client.db(`school-${assignedSchool}`)
    const usersCollection = schoolDb.collection<PrincipalDoc>('users')

    // Check if user with this email already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create the principal user document
    const newUser: PrincipalDoc = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      governmentId,
      employeeId,
      qualifications,
      yearsOfExperience,
      emergencyContact,
      startDate,
      contractDetails,
      role: 'school_admin', // Set role as school_admin for principals
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert the user into the school's users collection
    const result = await usersCollection.insertOne(newUser)

    // Also update the system-db schools collection to mark this principal
    const systemDb = client.db('system-db')
    await systemDb.collection('schools').updateOne(
      { _id: new Types.ObjectId(assignedSchool) },
      { 
        $set: { 
          principalId: result.insertedId,
          principalEmail: email,
          principalName: `${firstName} ${lastName}`
        }
      }
    )

    return NextResponse.json(
      { message: 'Principal created successfully' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error creating principal:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Error creating principal' },
      { status: 500 }
    )
  }
}
