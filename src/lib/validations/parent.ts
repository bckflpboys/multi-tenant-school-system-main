import * as z from "zod"

export const parentFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email("Please enter a valid email address").optional(),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  alternativePhoneNumber: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  governmentId: z.string().optional(),
  relationshipToStudent: z.string().min(2, {
    message: "Please specify relationship to student.",
  }),
  studentIds: z.array(z.string()).min(1, {
    message: "Please add at least one student ID.",
  }),
  emergencyContact: z.string().optional(),
  medicalInfo: z.string().optional(),
})

export type ParentFormValues = z.infer<typeof parentFormSchema>
