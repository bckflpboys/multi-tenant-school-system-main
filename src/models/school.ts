import { Schema, Document, Types } from "mongoose"
import { createModel } from "@/lib/createModel"

export interface ISchool extends Document {
  _id: Types.ObjectId;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  principalName: string;
  principalEmail: string;
  subscription: {
    tier: 'basic' | 'standard';
    features: Record<string, boolean>;
    aiFeatures?: string[];
  };
}

const schoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
    },
    principalName: {
      type: String,
      required: true,
    },
    principalEmail: {
      type: String,
      required: true,
    },
    subscription: {
      tier: {
        type: String,
        enum: ['basic', 'standard'],
        default: 'basic',
      },
      features: {
        type: Map,
        of: Boolean,
        default: {},
      },
      aiFeatures: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
)

export const getSchoolModel = createModel<ISchool>("School", schoolSchema)
