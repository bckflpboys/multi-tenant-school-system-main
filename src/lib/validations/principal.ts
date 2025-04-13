import * as z from "zod"

export const principalFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female"]),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  governmentId: z.string().min(6, {
    message: "Government ID must be at least 6 characters.",
  }),
  employeeId: z.string().min(3, {
    message: "Employee ID must be at least 3 characters.",
  }),
  qualifications: z.string().min(2, {
    message: "Qualifications must be at least 2 characters.",
  }),
  yearsOfExperience: z.string().min(1, {
    message: "Years of experience is required.",
  }),
  emergencyContact: z.string().min(10, {
    message: "Emergency contact must be at least 10 characters.",
  }),
  assignedSchool: z.string().optional(),
  startDate: z.string(),
  contractDetails: z.string().optional(),
})

export type PrincipalFormValues = z.infer<typeof principalFormSchema>
