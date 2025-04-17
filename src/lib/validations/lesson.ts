import * as z from "zod"

export const lessonFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  subjectId: z.string().min(1, {
    message: "Subject is required.",
  }),
  teacherId: z.string().min(1, {
    message: "Teacher is required.",
  }),
  gradeLevelId: z.string().min(1, {
    message: "Grade level is required.",
  }),
  startTime: z.string().min(1, {
    message: "Start time is required.",
  }),
  endTime: z.string().min(1, {
    message: "End time is required.",
  }),
  dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'], {
    required_error: "Day of week is required.",
  }),
  room: z.string().optional(),
  class: z.string().optional(),
  materials: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export type LessonFormValues = z.infer<typeof lessonFormSchema>
