import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getClassModel } from '@/models/class';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

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

    // Check if user has permission to create class in this school
    if (session.user.schoolId !== params.id && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get request data
    const data = await request.json();
    console.log('Creating class with data:', data);

    // Get class model for the school
    const ClassModel = await getClassModel(params.id);
    
    // Create the class
    const newClass = await ClassModel.create({
      name: data.name,
      grade: data.grade,
      section: data.grade, // Using grade as section for now
      academicYear: data.academicYear,
      capacity: data.capacity,
      teachers: data.teachers,
      schoolId: params.id,
    });

    console.log('Created class:', newClass);

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error('Error creating class:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { error: 'Invalid class data: ' + error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create class: ' + (error instanceof Error ? error.message : 'Unknown error') },
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

    // Check if user has permission to view classes in this school
    if (session.user.schoolId !== params.id && session.user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const ClassModel = await getClassModel(params.id);
    
    const classes = await ClassModel.find({ schoolId: params.id })
      .sort({ createdAt: -1 });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}
