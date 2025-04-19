import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import clientPromise from '@/lib/mongodb';

// Export the HTTP methods that this route handles
export const dynamic = 'force-dynamic'; // Ensure the route is dynamic
export const runtime = 'nodejs'; // Ensure running on Node.js runtime

export async function GET(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get school ID from URL
    const schoolId = req.nextUrl.pathname.split('/')[3];
    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    // Check if user has permission to view subjects in this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise;
    const schoolDb = client.db(`school-${schoolId}`);
    const subjectsCollection = schoolDb.collection('subjects');

    // Get all subjects for the school
    const subjects = await subjectsCollection
      .find({ schoolId })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get school ID from URL
    const schoolId = req.nextUrl.pathname.split('/')[3];
    if (!schoolId) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    // Check if user has permission to create subjects in this school
    if (session.user.schoolId !== schoolId && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get request body
    const data = await req.json();
    console.log('Creating subject with data:', data);

    // Get MongoDB client and connect to the school's database
    const client = await clientPromise;
    const schoolDb = client.db(`school-${schoolId}`);
    const subjectsCollection = schoolDb.collection('subjects');

    // Create new subject
    const newSubject = {
      name: data.name,
      description: data.description,
      schoolId,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await subjectsCollection.insertOne(newSubject);

    console.log('Created subject:', { ...newSubject, _id: result.insertedId });

    return NextResponse.json(
      { ...newSubject, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
