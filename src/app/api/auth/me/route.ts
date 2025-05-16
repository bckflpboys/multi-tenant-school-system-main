import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }

    // Default school name from session
    let schoolName = session.user.schoolName || "Unknown School"
    
    // If user is not a super admin and school name is not already set or is "Unknown School",
    // try to fetch it from the database
    if (session.user.role !== "super_admin" && 
        (schoolName === "Unknown School" || !schoolName)) {
      try {
        const client = await clientPromise
        const systemDb = client.db("system-db")
        
        // Validate school ID format
        let schoolObjectId
        try {
          schoolObjectId = new ObjectId(session.user.schoolId)
          
          // Query the schools collection
          const school = await systemDb.collection("schools").findOne({ _id: schoolObjectId })
          
          // Update school name if found
          if (school && school.name) {
            schoolName = school.name
          }
        } catch (error) {
          console.error("Invalid school ID or school not found:", error)
          // Continue with default schoolName
        }
      } catch (dbError) {
        console.error("Database error fetching school info:", dbError)
        // Continue with default schoolName
      }
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        userType: session.user.role,
        schoolId: session.user.schoolId,
        schoolName: schoolName
      }
    })
  } catch (error) {
    console.error("Error fetching user data:", error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    )
  }
}
