import * as z from "zod"

export const examinationFormSchema = z.object({
  title: z.string().min(2, {
    message: "Examination title must be at least 2 characters.",
  }),
  code: z.string().min(1, {
    message: "Examination code is required.",
  }),
  type: z.enum(["exam", "test", "assignment"], {
    required_error: "Type is required.",
  }),
  description: z.string().optional(),
  subject: z.string().min(1, {
    message: "Subject is required.",
  }),
  gradeLevel: z.string().min(1, {
    message: "Grade level is required.",
  }),
  examDate: z.string().min(1, {
    message: "Start date is required.",
  }),
  startTime: z.string().optional(),
  endDate: z.string().optional(),
  duration: z.number().optional(),
  totalMarks: z.number().min(1, {
    message: "Total marks must be at least 1.",
  }),
  passingMarks: z.number().min(1, {
    message: "Passing marks must be at least 1.",
  }),
  venue: z.string().optional(),
  examinerId: z.string().min(1, {
    message: "Examiner is required.",
  }),
  supervisors: z.array(z.string()).optional(),
  instructions: z.string().optional(),
}).refine((data) => {
  // If it's an exam or test, venue and time details are required
  if ((data.type === 'exam' || data.type === 'test')) {
    if (!data.venue || !data.startTime || !data.duration) {
      return false
    }
  }
  // If it's an assignment, endDate is required
  if (data.type === 'assignment' && !data.endDate) {
    return false
  }
  return true
}, {
  message: "Validation failed: For exams and tests, venue, start time, and duration are required. For assignments, end date is required.",
  path: ["type"],
})

export type ExaminationFormValues = z.infer<typeof examinationFormSchema>
