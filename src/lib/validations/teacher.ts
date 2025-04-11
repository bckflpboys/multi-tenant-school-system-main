import * as z from "zod"

export const teacherFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female"]),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().optional(),
  teacherId: z.string().min(3, {
    message: "Teacher School ID must be at least 3 characters.",
  }),
  governmentId: z.string().min(6, {
    message: "Government ID must be at least 6 characters.",
  }),
  subjects: z.array(z.string()).min(1, {
    message: "Please select at least one subject.",
  }),
  qualifications: z.string().optional(),
  emergencyContact: z.string().optional(),
  medicalInfo: z.string().optional(),
})

export type TeacherFormValues = z.infer<typeof teacherFormSchema>
