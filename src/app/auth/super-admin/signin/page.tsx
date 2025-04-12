import { Metadata } from "next"
import Link from "next/link"
import { SuperAdminAuthForm } from "@/components/auth/super-admin-auth-form"

export const metadata: Metadata = {
  title: "Super Admin Sign In",
  description: "Sign in to your super admin account",
}

export default function SuperAdminSignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Super Admin Sign In
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <SuperAdminAuthForm mode="signin" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Need a super admin account?{" "}
          <Link
            href="/auth/super-admin/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
