import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ZodError } from 'zod';
import clientPromise from '@/lib/mongodb';
import { subjectFormSchema } from '@/lib/validations/subject';

// Export the HTTP methods that this route handles
export const dynamic = 'force-dynamic'; // Ensure the route is dynamic
export const runtime = 'nodejs'; // Ensure running on Node.js runtime

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create subject in this school
    if (session.user.schoolId !== params.id && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get request data
    const data = await request.json();
    console.log('Creating subject with data:', data);

    // Validate the request body
    const validatedData = subjectFormSchema.parse(data);

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise;
    const schoolDb = client.db(`school-${params.id}`);
    const subjectsCollection = schoolDb.collection('subjects');
    
    // Create the subject
    const newSubject = {
      ...validatedData,
      schoolId: params.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the subject into the school's subjects collection
    const result = await subjectsCollection.insertOne(newSubject);
    console.log('Created subject:', result);

    return NextResponse.json(
      { message: 'Subject created successfully', subjectId: result.insertedId },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating subject:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating subject' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view subjects in this school
    if (session.user.schoolId !== params.id && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise;
    const schoolDb = client.db(`school-${params.id}`);
    const subjectsCollection = schoolDb.collection('subjects');

    // Get all subjects for the school
    const subjects = await subjectsCollection.find().sort({ createdAt: -1 }).toArray();

    return NextResponse.json(subjects);

  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Error fetching subjects' },
      { status: 500 }
    );
  }
}
