import * as z from "zod"

export const studentFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female"]),
  email: z.string().email("Please enter a valid email address").optional(),
  phoneNumber: z.string().optional(),
  studentAddress: z.string().optional(),
  grade: z.string(),
  class: z.string(),
  studentId: z.string().min(3, {
    message: "Student School ID must be at least 3 characters.",
  }),
  governmentId: z.string().min(6, {
    message: "Government ID must be at least 6 characters.",
  }),
  parentName: z.string().optional(),
  parentContact: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalInfo: z.string().optional(),
})

export type StudentFormValues = z.infer<typeof studentFormSchema>
