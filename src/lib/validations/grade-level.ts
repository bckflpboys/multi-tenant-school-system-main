import * as z from "zod"

export const gradeLevelFormSchema = z.object({
  name: z.string().min(2, {
    message: "Grade level name must be at least 2 characters.",
  }),
  code: z.string().min(1, {
    message: "Grade level code is required.",
  }),
  description: z.string().optional(),
  capacity: z.number().optional(),
  headTeacherId: z.array(z.string()).min(1, {
    message: "Please select at least one head teacher.",
  }),
  subjects: z.array(z.string()).min(1, {
    message: "Please add at least one subject.",
  }),
  fees: z.number().min(0, {
    message: "Fees cannot be negative.",
  }).optional(),
})

export type GradeLevelFormValues = z.infer<typeof gradeLevelFormSchema>
