import mongoose, { Schema, Document, Types } from "mongoose"
import { createModel } from "@/lib/createModel"

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: "super_admin" | "school_admin" | "teacher" | "staff" | "parent" | "student";
  image?: string;
  emailVerified?: Date;
  schoolId?: mongoose.Schema.Types.ObjectId
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["super_admin", "school_admin", "teacher", "staff", "parent", "student"],
      default: "student",
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },
    image: String,
    emailVerified: Date,
  },
  {
    timestamps: true,
  }
)

export const getUserModel = createModel<IUser>("User", userSchema)
