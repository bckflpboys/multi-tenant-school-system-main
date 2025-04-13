import { NextResponse } from "next/server"
import { schoolApiSchema } from "@/lib/validations/school"
import { Types } from "mongoose"
import { ZodError } from "zod"
import clientPromise from "@/lib/mongodb"
import { z } from "zod"

// Define the school document type
interface SchoolDoc extends z.infer<typeof schoolApiSchema> {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET() {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const systemDb = client.db('system-db');
    const schoolsCollection = systemDb.collection<SchoolDoc>('schools');

    // Fetch all schools
    const schools = await schoolsCollection.find({}).toArray();

    return NextResponse.json({ schools }, { status: 200 });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("Received school creation request");
    
    const json = await request.json()
    const body = schoolApiSchema.parse(json)

    const client = await clientPromise;
    const systemDb = client.db('system-db');
    const schoolsCollection = systemDb.collection<SchoolDoc>('schools');

    // Check if school email already exists
    const existingSchool = await schoolsCollection.findOne({ email: body.email })
    if (existingSchool) {
      return NextResponse.json(
        { message: "School with this email already exists" },
        { status: 400 }
      )
    }

    // Generate a new school ID
    const schoolId = new Types.ObjectId()

    // Create the school document
    const schoolDoc: SchoolDoc = {
      _id: schoolId,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the school in system-db
    await schoolsCollection.insertOne(schoolDoc)

    try {
      // Initialize the school's database
      const schoolDb = client.db(`school-${schoolId.toString()}`);
      
      // Create initial collections in the school's database
      const collections = ['users', 'classes', 'subjects'];
      for (const collection of collections) {
        await schoolDb.createCollection(collection);
      }

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
