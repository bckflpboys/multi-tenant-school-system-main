"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { disciplineFormSchema, type DisciplineFormValues } from "@/lib/validations/discipline"
import { Switch } from "@/components/ui/switch"

interface DisciplineFormProps {
  initialData?: DisciplineFormValues
  onSubmit: (data: DisciplineFormValues) => void
  isLoading: boolean
}

export function DisciplineForm({ initialData, onSubmit, isLoading }: DisciplineFormProps) {
  const form = useForm<DisciplineFormValues>({
    resolver: zodResolver(disciplineFormSchema),
    defaultValues: initialData ?? {
      studentId: "",
      incidentDate: "",
      incidentType: "",
      description: "",
      actionTaken: "",
      severity: "minor",
      status: "pending",
      reportedBy: "",
      parentNotified: false,
      notificationDate: "",
      followUpAction: "",
      comments: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Incident Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Student ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter student ID" 
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="incidentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Incident Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="incidentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Incident Type</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Bullying, Misconduct, Late Arrival" 
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Severity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white text-gray-900 border-gray-300 focus:border-gray-400">
                          <SelectValue placeholder="Select severity level" className="text-gray-500" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="minor">Minor</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="major">Major</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the incident"
                      className="min-h-[100px] resize-none border-gray-300 focus:border-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actionTaken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Action Taken</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the actions taken to address the incident"
                      className="min-h-[80px] resize-none border-gray-300 focus:border-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="reportedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Reported By</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Name of the person reporting" 
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white text-gray-900 border-gray-300 focus:border-gray-400">
                          <SelectValue placeholder="Select status" className="text-gray-500" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under-review">Under Review</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="parentNotified"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-300 p-4 space-y-0">
                    <div className="space-y-0.5">
                      <FormLabel className="text-gray-700">Parent Notified</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notificationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Notification Date</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="followUpAction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Follow-up Action (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any follow-up actions or recommendations"
                      className="min-h-[80px] resize-none border-gray-300 focus:border-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Additional Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional comments or notes"
                      className="min-h-[80px] resize-none border-gray-300 focus:border-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? "Saving..." : "Save Record"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
