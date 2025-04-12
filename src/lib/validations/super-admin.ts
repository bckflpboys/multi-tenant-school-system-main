import * as z from "zod"

// Schema for the frontend form (includes confirmPassword)
export const superAdminAuthSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).endsWith("@admin.com", {
    message: "Super admin email must end with @admin.com"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
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
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).endsWith("@admin.com", {
    message: "Super admin email must end with @admin.com"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export type SuperAdminAuthSchema = z.infer<typeof superAdminAuthSchema>
export type SuperAdminApiSchema = z.infer<typeof superAdminApiSchema>
