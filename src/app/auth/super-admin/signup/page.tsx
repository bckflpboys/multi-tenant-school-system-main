import { Metadata } from "next"
import Link from "next/link"
import { SuperAdminAuthForm } from "@/components/auth/super-admin-auth-form"

export const metadata: Metadata = {
  title: "Super Admin Sign Up",
  description: "Create a super admin account",
}

export default function SuperAdminSignUpPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Super Admin Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create your super admin account
          </p>
        </div>
        <SuperAdminAuthForm mode="signup" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/super-admin/signin"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
