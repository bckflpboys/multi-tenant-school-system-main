import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClass extends Document {
  name: string;
  grade: string;
  section: string;
  academicYear: string;
  capacity?: number;
  teachers: string[];
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  section: { type: String, required: true },
  academicYear: { type: String, required: true },
  capacity: { type: Number },
  teachers: [{ type: String }],
  schoolId: { type: String, required: true },
}, {
  timestamps: true
});

// Cache connections to avoid creating new ones for every request
const connections: { [key: string]: mongoose.Connection } = {};

export type ClassModel = Model<IClass>;

export async function getClassModel(schoolId: string): Promise<ClassModel> {
  try {
    const dbName = `school-${schoolId}`;
    
    // Check if we already have a connection for this school
    if (!connections[dbName]) {
      // Get the base URI without the database name
      const uri = process.env.MONGODB_URI!;
      if (!uri) {
        throw new Error('MONGODB_URI is not defined');
      }

      const [baseUri] = uri.split('?');
      const query = uri.split('?')[1] || '';
      
      // Remove the last part (database name) from the base URI
      const baseUriWithoutDb = baseUri.split('/').slice(0, -1).join('/');
      const schoolUri = `${baseUriWithoutDb}/${dbName}?${query}`;
      
      // Create a new connection for this specific school database
      connections[dbName] = mongoose.createConnection(schoolUri);
      
      // Handle connection events
      connections[dbName].on('connected', () => {
        console.log('Connected to database:', dbName);
      });

      connections[dbName].on('error', (err) => {
        console.error('Database connection error:', err);
        delete connections[dbName];
      });
    }

    // Wait for the connection to be ready
    await connections[dbName].asPromise();
    
    // Return the model
    return connections[dbName].model<IClass>('Class', ClassSchema);
  } catch (error) {
    console.error('Error getting class model:', error);
    throw error;
  }
}
