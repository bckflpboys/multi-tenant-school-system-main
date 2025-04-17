import * as z from "zod"

export const announcementFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  type: z.enum(["general", "academic", "event", "emergency"]),
  targetAudience: z.array(z.enum(["all", "students", "teachers", "parents", "staff"])).min(1, {
    message: "Select at least one target audience.",
  }),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
  endDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  attachments: z.array(z.string()).optional(),
  schoolId: z.string().min(1, {
    message: "School ID is required.",
  }),
  gradeLevelIds: z.array(z.string()).optional(),
  subjectIds: z.array(z.string()).optional(),
})

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>
