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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { examinationFormSchema, type ExaminationFormValues } from "@/lib/validations/examination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateExamCode } from "@/lib/utils/generate-exam-code"

interface ExaminationFormProps {
  initialData?: ExaminationFormValues
  onSubmit: (data: ExaminationFormValues) => void
  isLoading?: boolean
}

export function ExaminationForm({ initialData, onSubmit, isLoading }: ExaminationFormProps) {
  const form = useForm<ExaminationFormValues>({
    resolver: zodResolver(examinationFormSchema),
    defaultValues: initialData ?? {
      title: "",
      code: "",
      type: "exam",
      description: "",
      subject: "",
      gradeLevel: "",
      examDate: "",
      startTime: "",
      endDate: "",
      duration: 60,
      totalMarks: 100,
      passingMarks: 50,
      venue: "",
      examinerId: "",
      supervisors: [],
      instructions: "",
    },
  })

  const type = form.watch("type")
  const isAssignment = type === "assignment"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Examination Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter examination title (e.g., Mid-Term Mathematics)" 
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
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Examination Code</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          placeholder="Enter or generate examination code" 
                          {...field}
                          className="h-11 border-gray-300 focus:border-gray-400"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="default"
                        className="h-11"
                        onClick={() => {
                          const title = form.getValues("title")
                          const subject = form.getValues("subject")
                          const gradeLevel = form.getValues("gradeLevel")
                          
                          console.log("Current values:", { title, subject, gradeLevel })
                          
                          if (title && subject && gradeLevel) {
                            const code = generateExamCode(title, subject, gradeLevel)
                            console.log("Generated code:", code)
                            form.setValue("code", code, { shouldValidate: true })
                          } else {
                            alert("Please fill in Title, Subject and Grade Level first")
                          }
                        }}
                      >
                        Generate Code
                      </Button>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white border-gray-300 h-11 text-gray-900">
                        <SelectValue placeholder="Select type" className="text-gray-900" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="exam" className="text-gray-900">Exam</SelectItem>
                      <SelectItem value="test" className="text-gray-900">Test</SelectItem>
                      <SelectItem value="assignment" className="text-gray-900">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter examination description"
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
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Subject</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter subject" 
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
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Grade Level</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter grade level (e.g., G1, K1)" 
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Schedule & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="examDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">{isAssignment ? 'Start Date' : 'Exam Date'}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="h-11 border-gray-300 focus:border-gray-400" />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {isAssignment ? (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-11 border-gray-300 focus:border-gray-400" />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} className="h-11 border-gray-300 focus:border-gray-400" />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            className="h-11 border-gray-300 focus:border-gray-400"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {!isAssignment && (
                <FormField
                  control={form.control}
                  name="venue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Venue</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter venue" 
                          {...field} 
                          className="h-11 border-gray-300 focus:border-gray-400"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Grading & Staff</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="totalMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Total Marks</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passingMarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Passing Marks</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
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
                name="examinerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Examiner ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter examiner ID" 
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
                name="supervisors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Supervisors (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter supervisor IDs (comma separated)" 
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => field.onChange(e.target.value.split(',').map(id => id.trim()).filter(id => id !== ""))}
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
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter examination instructions"
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

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? "Creating..." : "Create Examination"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
