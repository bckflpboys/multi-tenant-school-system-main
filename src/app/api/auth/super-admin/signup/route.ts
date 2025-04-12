import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getUserModel } from "@/models/user"
import { superAdminApiSchema } from "@/lib/validations/super-admin"
import { ZodError } from "zod"

export async function POST(req: Request) {
  try {
    console.log("Received signup request");
    const json = await req.json()
    console.log("Request body:", { ...json, password: "[REDACTED]" });

    const body = superAdminApiSchema.parse(json)
    console.log("Validation passed");

    // Get the User model for the default database (no schoolId for super admin)
    const User = await getUserModel()
    console.log("Got User model");

    // Check if a super admin already exists
    const existingSuperAdmin = await User.findOne({ role: "super_admin" })
    if (existingSuperAdmin) {
      console.log("Super admin already exists");
      return NextResponse.json(
        { message: "Super admin already exists" },
        { status: 400 }
      )
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      console.log("Email already exists");
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(body.password, 10)
    console.log("Password hashed");

    // Create the super admin user
    await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: "super_admin",
    })
    console.log("Super admin created successfully");

    return NextResponse.json(
      { message: "Super admin created successfully" },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Error creating super admin:", error)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          message: "Validation error", 
          errors: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "Something went wrong", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
