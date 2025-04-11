import * as z from "zod"

export const subjectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Subject name must be at least 2 characters.",
  }),
  code: z.string().min(1, {
    message: "Subject code is required.",
  }),
  description: z.string().optional(),
  department: z.string().optional(),
  gradeLevel: z.string().min(1, {
    message: "Grade level is required.",
  }),
  headTeacherId: z.string().min(1, {
    message: "Head teacher is required.",
  }),
  teacherIds: z.array(z.string()).min(1, {
    message: "Please add at least one teacher.",
  }),
  credits: z.number().min(0, {
    message: "Credits cannot be negative.",
  }).optional(),
})

export type SubjectFormValues = z.infer<typeof subjectFormSchema>
