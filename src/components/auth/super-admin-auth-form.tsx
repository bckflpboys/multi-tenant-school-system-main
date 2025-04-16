"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { superAdminSignInSchema, superAdminSignUpSchema, type SuperAdminSignInSchema, type SuperAdminSignUpSchema } from "@/lib/validations/super-admin"
import { signIn } from "next-auth/react"

interface SuperAdminAuthFormProps {
  mode: "signup" | "signin"
}

export function SuperAdminAuthForm({ mode }: SuperAdminAuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const schema = mode === "signin" ? superAdminSignInSchema : superAdminSignUpSchema
  const form = useForm<SuperAdminSignInSchema | SuperAdminSignUpSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(mode === "signup" ? { name: "" } : {}),
      email: "",
      password: "",
      ...(mode === "signup" ? { confirmPassword: "" } : {}),
    },
  })

  async function onSubmit(data: SuperAdminSignInSchema | SuperAdminSignUpSchema) {
    setIsLoading(true)

    try {
      if (mode === "signup") {
        const response = await fetch("/api/auth/super-admin/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: (data as SuperAdminSignUpSchema).name,
            email: data.email,
            password: data.password,
          }),
        })

        const responseData = await response.json()

        if (!response.ok) {
          throw new Error(responseData.message || "Something went wrong")
        }

        toast.success("Super admin account created successfully!")
      }

      // Sign in after successful signup or when in signin mode
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/dashboard"
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error)
      }

      if (signInResult?.ok) {
        toast.success("Logged in successfully!")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {mode === "signup" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@admin.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === "signup" && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button 
          className="w-full" 
          type="submit" 
          disabled={isLoading}
          onClick={() => console.log("Button clicked")}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "signup" ? "Create Account" : "Sign In"}
        </Button>
      </form>
    </Form>
  )
}
