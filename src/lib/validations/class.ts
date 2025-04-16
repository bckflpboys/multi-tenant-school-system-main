import * as z from "zod"

export const classFormSchema = z.object({
  name: z.string().min(2, {
    message: "Class name must be at least 2 characters.",
  }),
  teachers: z.array(z.string().min(2, {
    message: "Teacher name must be at least 2 characters.",
  })).min(1, {
    message: "At least one teacher is required.",
  }),
  grade: z.string(),
  academicYear: z.string(),
  capacity: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'string') {
      return val === '' ? undefined : parseInt(val);
    }
    return val;
  }).optional(),
})

export type ClassFormValues = z.infer<typeof classFormSchema>
