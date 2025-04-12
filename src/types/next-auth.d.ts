import { DefaultSession, DefaultUser } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      schoolId: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: string
    schoolId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    role: string
    schoolId: string
  }
}
