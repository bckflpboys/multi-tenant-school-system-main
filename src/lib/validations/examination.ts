import * as z from "zod"

export const examinationFormSchema = z.object({
  title: z.string().min(2, {
    message: "Examination title must be at least 2 characters.",
  }),
  code: z.string().min(1, {
    message: "Examination code is required.",
  }),
  description: z.string().optional(),
  subject: z.string().min(1, {
    message: "Subject is required.",
  }),
  gradeLevel: z.string().min(1, {
    message: "Grade level is required.",
  }),
  examDate: z.string().min(1, {
    message: "Exam date is required.",
  }),
  startTime: z.string().min(1, {
    message: "Start time is required.",
  }),
  duration: z.number().min(1, {
    message: "Duration must be at least 1 minute.",
  }),
  totalMarks: z.number().min(1, {
    message: "Total marks must be at least 1.",
  }),
  passingMarks: z.number().min(1, {
    message: "Passing marks must be at least 1.",
  }),
  venue: z.string().min(1, {
    message: "Venue is required.",
  }),
  examinerId: z.string().min(1, {
    message: "Examiner is required.",
  }),
  supervisors: z.array(z.string()).optional(),
  instructions: z.string().optional(),
})

export type ExaminationFormValues = z.infer<typeof examinationFormSchema>
