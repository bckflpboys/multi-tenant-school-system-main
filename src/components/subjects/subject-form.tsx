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
import { Textarea } from "@/components/ui/textarea"
import { subjectFormSchema, type SubjectFormValues } from "@/lib/validations/subject"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SubjectFormProps {
  initialData?: SubjectFormValues
  onSubmit: (data: SubjectFormValues) => void
  isLoading?: boolean
}

export function SubjectForm({ initialData, onSubmit, isLoading }: SubjectFormProps) {
  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: initialData ?? {
      name: "",
      code: "",
      description: "",
      department: "",
      gradeLevel: "",
      headTeacherId: "",
      teacherIds: [],
      credits: undefined,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Subject Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Subject Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter subject name (e.g., Mathematics, English)" 
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
                    <FormLabel className="text-gray-700">Subject Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter subject code (e.g., MATH101, ENG101)" 
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter subject description (optional)"
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
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Department (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter department (e.g., Mathematics, Sciences, Languages) - Optional" 
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

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="headTeacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Head Teacher</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter head teacher ID" 
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
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Credits</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Enter credits (optional)" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
              name="teacherIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Teachers</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter teacher IDs (comma separated)" 
                      value={field.value.join(", ")}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(id => id.trim()).filter(id => id !== ""))}
                      className="h-11 border-gray-300 focus:border-gray-400"
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
            {isLoading ? "Creating..." : "Create Subject"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
