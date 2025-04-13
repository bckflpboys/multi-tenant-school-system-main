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
interface SchoolResponse extends Omit<SchoolDoc, '_id'> {
  _id: string;
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
    const { id } = await context.params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid school ID" },
        { status: 400 }
      );
    }

    console.log('Fetching school with ID:', id);
    console.log('Converted ObjectId:', new Types.ObjectId(id));

    // Connect to MongoDB
    const client = await clientPromise;
    
    // Get school info from system-db first
    const systemDb = client.db('system-db');
    const schoolsCollection = systemDb.collection<SchoolDoc>('schools');
    
    // Try both ObjectId and string matching
    const school = await schoolsCollection.findOne({
      $or: [
        { _id: new Types.ObjectId(id) },
        { _id: id }
      ]
    });

    console.log('Found school:', school); // Debug log

    if (!school) {
      return NextResponse.json(
        { message: "School not found" },
        { status: 404 }
      );
    }

    // Get stats from school's database
    const schoolDb = client.db(`school-${id}`);
    
    try {
      // Get counts of various collections
      const [usersCount, classesCount, subjectsCount] = await Promise.all([
        schoolDb.collection('users').countDocuments(),
        schoolDb.collection('classes').countDocuments(),
        schoolDb.collection('subjects').countDocuments()
      ]);

      const schoolWithStats: SchoolResponse = {
        ...school,
        _id: school._id.toString(),
        stats: {
          users: usersCount,
          classes: classesCount,
          subjects: subjectsCount
        }
      };

      return NextResponse.json({ school: schoolWithStats });
    } catch (statsError) {
      console.error('Error fetching school stats:', statsError);
      // Return school data without stats if we can't get them
      const schoolWithoutStats: SchoolResponse = {
        ...school,
        _id: school._id.toString(),
        stats: {
          users: 0,
          classes: 0,
          subjects: 0
        }
      };

      return NextResponse.json({ school: schoolWithoutStats });
    }
  } catch (error) {
    console.error("Error fetching school:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
