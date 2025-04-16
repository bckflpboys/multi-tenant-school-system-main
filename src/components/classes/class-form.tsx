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
import { X } from "lucide-react"

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
      teachers: [""],
      grade: "",
      academicYear: "",
      capacity: undefined,
    },
  })

  const addTeacher = () => {
    const currentTeachers = form.getValues("teachers")
    form.setValue("teachers", [...currentTeachers, ""])
  }

  const removeTeacher = (index: number) => {
    const currentTeachers = form.getValues("teachers")
    if (currentTeachers.length > 1) {
      form.setValue("teachers", currentTeachers.filter((_, i) => i !== index))
    }
  }

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
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel className="text-gray-700">Teachers</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTeacher}
              className="h-8"
            >
              Add Teacher
            </Button>
          </div>
          
          {form.watch("teachers").map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`teachers.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
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
              {form.watch("teachers").length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTeacher(index)}
                  className="h-11 w-11"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

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
                  placeholder="Enter maximum number of students"
                  className="h-11"
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : '')}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Class"}
        </Button>
      </form>
    </Form>
  )
}
