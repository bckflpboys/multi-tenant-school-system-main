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
import { classFormSchema, type ClassFormValues } from "@/lib/validations/class"

interface ClassFormProps {
  initialData?: ClassFormValues
  onSubmit: (data: ClassFormValues) => void
  isLoading?: boolean
}

export function ClassForm({ initialData, onSubmit, isLoading }: ClassFormProps) {
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues: initialData ?? {
      name: "",
      teacher: "",
      grade: "",
      academicYear: "",
      capacity: undefined,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Class Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., 8A, 7A1, 10T" 
                  {...field}
                  className="h-11"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Teacher</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter teacher's name"
                  className="h-11"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Grade Level</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., 8, 9, 10" 
                  {...field}
                  className="h-11"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="academicYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Academic Year</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., 2024-2025" 
                  {...field}
                  className="h-11"
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
              <FormLabel className="text-gray-700">Class Capacity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Maximum number of students" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="h-11"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading ? "Creating..." : "Create Class"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
