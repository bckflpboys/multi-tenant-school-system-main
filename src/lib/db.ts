import mongoose from "mongoose"
import { tenantService } from "./multiTenancy"

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  } | null;
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  )
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB(schoolId?: string) {
  try {
    const connection = await tenantService.getConnection(schoolId)
    return connection
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw error
  }
}

export const db = { connectDB }
