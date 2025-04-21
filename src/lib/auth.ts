import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserModel, IUser } from "@/models/user"
import { Model } from "mongoose"
import { User } from "next-auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    schoolId: string
    schoolName?: string
  }

  interface Session {
    user: User & {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

interface Credentials {
  email: string;
  password: string;
  schoolId?: string;
  userType?: string;
}

// Map user types to collections and roles
const userTypeConfig: Record<string, { collection: string, role: string }> = {
  student: { collection: 'students', role: 'student' },
  teacher: { collection: 'teachers', role: 'teacher' },
  staff: { collection: 'staff', role: 'staff' },
  principal: { collection: 'users', role: 'school_admin' }
}

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("Please define NEXTAUTH_SECRET environment variable")
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/school/signin", // Default sign-in page
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        schoolId: { label: "School ID", type: "text" },
        userType: { label: "User Type", type: "text" }
      },
      async authorize(credentials: Credentials | undefined): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please enter both email and password")
          }

          const isSuperAdmin = credentials.email.endsWith('@admin.com')
          
          if (isSuperAdmin) {
            // Handle super admin auth
            const User: Model<IUser> = await getUserModel()
            const user = await User.findOne({ email: credentials.email }).lean()

            if (!user || !user?.password) {
              throw new Error("Invalid credentials")
            }

            const isCorrectPassword = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isCorrectPassword) {
              throw new Error("Invalid credentials")
            }

            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: 'super_admin',
              schoolId: 'system',
              schoolName: 'System'
            } as User
          } else {
            // Handle school user auth
            if (!credentials.schoolId || !credentials.userType) {
              throw new Error("Please select both school and user type")
            }

            const config = userTypeConfig[credentials.userType]
            if (!config) {
              throw new Error("Invalid user type selected")
            }

            const client = await clientPromise
            const schoolDb = client.db(`school-${credentials.schoolId}`)
            const collection = schoolDb.collection(config.collection)

            // Find user by email
            const user = await collection.findOne({ email: credentials.email })
            console.log('Found user:', user ? 'Yes' : 'No', 'in collection:', config.collection)

            if (!user) {
              throw new Error("No user found with this email in the selected role")
            }

            const isCorrectPassword = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isCorrectPassword) {
              throw new Error("Incorrect password")
            }

            // Get school name from system-db
            const systemDb = client.db('system-db')
            let schoolObjectId;
            try {
              schoolObjectId = new ObjectId(credentials.schoolId);
            } catch (error) {
              console.error('Invalid school ID format:', error);
              return null; // Return null if we can't create a valid ObjectId
            }
            const school = await systemDb.collection('schools').findOne({ _id: schoolObjectId })

            return {
              id: user._id.toString(),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: config.role,
              schoolId: credentials.schoolId,
              schoolName: school?.name || 'Unknown School'
            } as User
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.schoolId = user.schoolId
        token.schoolName = user.schoolName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.schoolId = token.schoolId as string
        session.user.schoolName = token.schoolName as string | undefined
      }
      return session
    }
  },
}
