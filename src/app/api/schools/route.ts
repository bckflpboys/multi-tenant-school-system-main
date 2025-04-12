import { NextResponse } from "next/server"
import { schoolApiSchema } from "@/lib/validations/school"
import { Types } from "mongoose"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { z } from "zod"

// Define the school document type
interface SchoolDoc extends z.infer<typeof schoolApiSchema> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  try {
    console.log("Received school creation request");
    
    // Parse and validate the request body
    const json = await request.json()
    console.log("Request body:", json);
    
    const body = schoolApiSchema.parse(json)
    console.log("Validation passed");

    // Connect to MongoDB
    const client = await clientPromise;
    const systemDb = client.db('system-db');
    const schoolsCollection = systemDb.collection<SchoolDoc>('schools');
    console.log("Connected to system-db");

    // Check if school email already exists
    const existingSchool = await schoolsCollection.findOne({ email: body.email })
    if (existingSchool) {
      console.log("School email already exists");
      return NextResponse.json(
        { message: "School with this email already exists" },
        { status: 400 }
      )
    }

    // Generate a new school ID
    const schoolId = new Types.ObjectId().toString()

    // Create the school document
    const schoolDoc: SchoolDoc = {
      _id: schoolId,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the school in system-db
    await schoolsCollection.insertOne(schoolDoc)
    console.log("Created school in system-db:", schoolId);

    try {
      // Initialize the school's database
      const schoolDb = client.db(`school-${schoolId}`);
      
      // Create initial collections in the school's database
      const collections = ['users', 'classes', 'subjects'];
      for (const collection of collections) {
        await schoolDb.createCollection(collection);
      }
      console.log("Created initial collections in school's database");

      return NextResponse.json(
        { 
          message: "School created successfully", 
          school: schoolDoc
        },
        { status: 201 }
      )
    } catch (error) {
      // If school database initialization fails, delete the school from system-db
      await schoolsCollection.deleteOne({ _id: schoolId });
      throw new Error("Failed to initialize school database: " + (error instanceof Error ? error.message : String(error)));
    }
  } catch (error) {
    console.error("Error creating school:", error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          message: "Validation error", 
          errors: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
