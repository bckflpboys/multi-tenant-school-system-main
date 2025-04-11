import * as z from "zod"

export const classFormSchema = z.object({
  name: z.string().min(2, {
    message: "Class name must be at least 2 characters.",
  }),
  teacher: z.string().min(2, {
    message: "Teacher name must be at least 2 characters.",
  }),
  grade: z.string(),
  academicYear: z.string(),
  capacity: z.number().min(1).optional(),
})

export type ClassFormValues = z.infer<typeof classFormSchema>
