import * as z from "zod"

export const staffFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female"]),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().optional(),
  staffId: z.string().min(3, {
    message: "Staff School ID must be at least 3 characters.",
  }),
  governmentId: z.string().min(6, {
    message: "Government ID must be at least 6 characters.",
  }),
  department: z.string().min(2, {
    message: "Please specify department.",
  }),
  position: z.string().min(2, {
    message: "Please specify position.",
  }),
  joiningDate: z.string(),
  employmentType: z.enum(["full-time", "part-time", "contract", "temporary"]),
  emergencyContact: z.string().optional(),
  medicalInfo: z.string().optional(),
})

export type StaffFormValues = z.infer<typeof staffFormSchema>
