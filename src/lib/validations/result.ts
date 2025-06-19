import * as z from "zod"

export const resultFormSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  subject: z.string().min(1, "Subject is required"),
  examType: z.enum(["Quiz", "Test", "Midterm", "Final"], {
    required_error: "Please select an exam type",
  }),
  score: z.number().min(0, "Score must be 0 or greater"),
  totalMarks: z.number().min(1, "Total marks must be greater than 0"),
  term: z.enum(["First", "Second", "Third"], {
    required_error: "Please select a term",
  }),
  academicYear: z.string().min(1, "Academic year is required"),
  remarks: z.string().optional(),
})

export type ResultFormValues = z.infer<typeof resultFormSchema>
