import * as z from "zod"

export const disciplineFormSchema = z.object({
  studentId: z.string().min(3, {
    message: "Student ID must be at least 3 characters.",
  }),
  incidentDate: z.string(),
  incidentType: z.string().min(2, {
    message: "Incident type must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  actionTaken: z.string().min(5, {
    message: "Action taken must be at least 5 characters.",
  }),
  severity: z.enum(["minor", "moderate", "major"]),
  status: z.enum(["pending", "resolved", "under-review"]),
  reportedBy: z.string().min(2, {
    message: "Reporter name must be at least 2 characters.",
  }),
  parentNotified: z.boolean(),
  notificationDate: z.string().optional(),
  followUpAction: z.string().optional(),
  comments: z.string().optional(),
})

export type DisciplineFormValues = z.infer<typeof disciplineFormSchema>
