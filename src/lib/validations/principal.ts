import * as z from "zod"

export const principalFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  phoneNumber: z.union([z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }), z.string().length(0)]),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"]),
  address: z.union([z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }), z.string().length(0)]),
  governmentId: z.union([z.string().min(6, {
    message: "Government ID must be at least 6 characters.",
  }), z.string().length(0)]),
  employeeId: z.union([z.string().min(3, {
    message: "Employee ID must be at least 3 characters.",
  }), z.string().length(0)]),
  qualifications: z.union([z.string().min(2, {
    message: "Qualifications must be at least 2 characters.",
  }), z.string().length(0)]),
  yearsOfExperience: z.string().optional(),
  emergencyContact: z.union([z.string().min(10, {
    message: "Emergency contact must be at least 10 characters.",
  }), z.string().length(0)]),
  assignedSchool: z.string().min(1, "Please select a school"),
  startDate: z.string().optional(),
  contractDetails: z.string().optional(),
})

export type PrincipalFormValues = z.infer<typeof principalFormSchema>
