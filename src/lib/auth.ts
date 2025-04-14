import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserModel, IUser } from "@/models/user"
import { Model } from "mongoose"
import { User } from "next-auth"
import clientPromise from "@/lib/mongodb"

declare module "next-auth" {
  interface User {
    schoolName?: string
  }
}

interface Credentials {
  email: string;
  password: string;
  schoolId?: string;
  userType?: string;
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
    signIn: "/auth/login",
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
            throw new Error("Invalid credentials")
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
              role: user.role
            } as User
          } else {
            // Handle school user auth
            const client = await clientPromise
            const schoolDb = client.db(`school-${credentials.schoolId}`)
            const usersCollection = schoolDb.collection('users')

            const user = await usersCollection.findOne({
              email: credentials.email,
              role: credentials.userType === 'principal' ? 'school_admin' : credentials.userType
            })

            if (!user) {
              throw new Error("Invalid credentials")
            }

            const isCorrectPassword = await bcrypt.compare(
              credentials.password,
              user.password
            )

            if (!isCorrectPassword) {
              throw new Error("Invalid credentials")
            }

            // Get school name from system-db
            const systemDb = client.db('system-db')
            const school = await systemDb.collection('schools').findOne({ _id: user.schoolId })

            return {
              id: user._id.toString(),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: user.role,
              schoolId: credentials.schoolId,
              schoolName: school?.name || 'Unknown School'
            } as User
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          schoolId: user.schoolId,
          schoolName: user.schoolName
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          schoolId: token.schoolId,
          schoolName: token.schoolName
        },
      }
    },
  },
}
