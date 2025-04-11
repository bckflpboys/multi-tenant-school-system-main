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
import { gradeLevelFormSchema, type GradeLevelFormValues } from "@/lib/validations/grade-level"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GradeLevelFormProps {
  initialData?: GradeLevelFormValues
  onSubmit: (data: GradeLevelFormValues) => void
  isLoading?: boolean
}

export function GradeLevelForm({ initialData, onSubmit, isLoading }: GradeLevelFormProps) {
  const form = useForm<GradeLevelFormValues>({
    resolver: zodResolver(gradeLevelFormSchema),
    defaultValues: initialData ?? {
      name: "",
      code: "",
      description: "",
      capacity: undefined,
      headTeacherId: "",
      subjects: [],
      fees: undefined,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Grade Level Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Grade Level Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter grade level name" 
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
                    <FormLabel className="text-gray-700">Grade Level Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter grade level code" 
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
                      placeholder="Enter grade level description (optional)"
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
                name="academicYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Academic Year</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter academic year" 
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Enter maximum capacity (optional)" 
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
              name="headTeacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Head Teacher</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter head teacher ID (optional)" 
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
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Subjects</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter subjects (comma separated)" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                      className="h-11 border-gray-300 focus:border-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Fees</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="Enter fees amount (optional)" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
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
            {isLoading ? "Creating..." : "Create Grade Level"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
