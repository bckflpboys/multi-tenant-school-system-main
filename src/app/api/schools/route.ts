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
    const schools = await schoolsCollection.find({}, {
      projection: { _id: 1, name: 1 }  // Only return _id and name fields
    }).toArray();

    // Transform ObjectId to string
    const formattedSchools = schools.map(school => ({
      _id: school._id.toString(),
      name: school.name
    }));

    // Set CORS headers
    return new NextResponse(JSON.stringify({ schools: formattedSchools }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return new NextResponse(
      JSON.stringify({ 
        message: "Something went wrong", 
        error: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
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
      return new NextResponse(
        JSON.stringify({ 
          message: "School with this email already exists" 
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
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

      return new NextResponse(
        JSON.stringify({ 
          message: "School created successfully", 
          school: schoolDoc
        }),
        { 
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      // If school database initialization fails, delete the school from system-db
      await schoolsCollection.deleteOne({ _id: schoolId });
      throw new Error("Failed to initialize school database: " + (error instanceof Error ? error.message : String(error)));
    }
  } catch (error) {
    console.error("Error creating school:", error)
    if (error instanceof ZodError) {
      return new NextResponse(
        JSON.stringify({ 
          message: "Validation error", 
          errors: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        }),
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }
    return new NextResponse(
      JSON.stringify({ 
        message: "Something went wrong", 
        error: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
