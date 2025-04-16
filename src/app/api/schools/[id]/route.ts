import { NextRequest, NextResponse } from 'next/server'
import { Types } from "mongoose"
import clientPromise from "@/lib/mongodb"
import { z } from "zod"
import { schoolApiSchema } from "@/lib/validations/school"

// Define the school document type with MongoDB types
interface SchoolDoc extends Omit<z.infer<typeof schoolApiSchema>, '_id'> {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the response type
interface SchoolResponse {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  stats: {
    users: number;
    classes: number;
    subjects: number;
  };
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    // Get the client
    const client = await clientPromise;
    const systemDb = client.db();

    // Get the schools collection with type
    const schoolsCollection = systemDb.collection<SchoolDoc>('schools');
    
    // Try to find school by ObjectId
    const school = await schoolsCollection.findOne({
      _id: new Types.ObjectId(id)
    });

    console.log('Found school:', school); // Debug log

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    // Get stats from the school's database
    const schoolDb = client.db(`school-${id}`);

    // Get counts from collections
    const [usersCount, classesCount, subjectsCount] = await Promise.all([
      schoolDb.collection('users').countDocuments(),
      schoolDb.collection('classes').countDocuments(),
      schoolDb.collection('subjects').countDocuments()
    ]);

    // Convert MongoDB document to response format
    const response: SchoolResponse = {
      _id: school._id.toString(),
      name: school.name,
      email: school.email,
      phone: school.phone,
      address: school.address,
      createdAt: school.createdAt.toISOString(),
      updatedAt: school.updatedAt.toISOString(),
      stats: {
        users: usersCount,
        classes: classesCount,
        subjects: subjectsCount
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/schools/[id]:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
