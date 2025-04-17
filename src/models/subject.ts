import mongoose, { Document, Model } from 'mongoose';

export interface ISubject {
  name: string;
  code: string;
  description?: string;
  department?: string;
  gradeLevel: string;
  headTeacherId?: string;
  teacherIds: string[];
  credits?: number;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubjectDocument extends ISubject, Document {}

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Subject code is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  gradeLevel: {
    type: String,
    required: [true, 'Grade level is required'],
    trim: true
  },
  headTeacherId: {
    type: String,
    trim: true
  },
  teacherIds: {
    type: [String],
    default: []
  },
  credits: {
    type: Number
  },
  schoolId: {
    type: String,
    required: [true, 'School ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
subjectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export async function getSubjectModel(schoolId: string): Promise<Model<ISubjectDocument>> {
  const modelName = `Subject_${schoolId}`;
  
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as Model<ISubjectDocument>;
  }

  return mongoose.model<ISubjectDocument>(modelName, subjectSchema);
}
