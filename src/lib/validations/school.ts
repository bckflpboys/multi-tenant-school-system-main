import * as z from "zod"

export const schoolApiSchema = z.object({
  name: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL.",
  }).or(z.literal('')).optional(),
  description: z.string().optional(),
  principalName: z.string().min(2, {
    message: "Principal name must be at least 2 characters.",
  }),
  principalEmail: z.string().email({
    message: "Please enter a valid principal email address.",
  }),
  subscription: z.object({
    tier: z.enum(['basic', 'standard']),
    features: z.record(z.boolean()),
    aiFeatures: z.array(z.string()).optional(),
  }),
})
