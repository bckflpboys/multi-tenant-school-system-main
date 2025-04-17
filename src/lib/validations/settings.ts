import * as z from "zod"

export const settingsFormSchema = z.object({
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
  }).optional(),
  academicYear: z.string({
    required_error: "Please select an academic year.",
  }),
  timeZone: z.string({
    required_error: "Please select a time zone.",
  }),
  logo: z.string().optional(),
  schoolId: z.string().min(1, {
    message: "School ID is required.",
  }),
})

export type SettingsFormValues = z.infer<typeof settingsFormSchema>
