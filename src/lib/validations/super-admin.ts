import * as z from "zod"

// Base schema for common fields
const baseSchema = {
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).endsWith("@admin.com", {
    message: "Super admin email must end with @admin.com"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
}

// Schema for signin
export const superAdminSignInSchema = z.object(baseSchema)

// Schema for signup (includes additional fields)
export const superAdminSignUpSchema = z.object({
  ...baseSchema,
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Schema for the API (excludes confirmPassword)
export const superAdminApiSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  ...baseSchema,
})

export type SuperAdminSignInSchema = z.infer<typeof superAdminSignInSchema>
export type SuperAdminSignUpSchema = z.infer<typeof superAdminSignUpSchema>
export type SuperAdminApiSchema = z.infer<typeof superAdminApiSchema>
