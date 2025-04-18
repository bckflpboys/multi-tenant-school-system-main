"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
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
import { classFormSchema, type ClassFormValues } from "@/lib/validations/class"

interface GradeLevel {
  _id: string
  name: string
  code: string
}

interface Teacher {
  _id: string
  firstName: string
  lastName: string
  email: string
  teacherId: string
}

interface ClassFormProps {
  initialData?: ClassFormValues
  onSubmit: (data: ClassFormValues) => void
  isLoading?: boolean
}

export function ClassForm({ initialData, onSubmit, isLoading }: ClassFormProps) {
  const { data: session } = useSession()
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [isLoadingGradeLevels, setIsLoadingGradeLevels] = useState(true)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true)

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

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.schoolId) return
      
      try {
        setIsLoadingGradeLevels(true)
        setIsLoadingTeachers(true)

        // Fetch grade levels
        const gradeLevelsResponse = await fetch(`/api/grade-levels?schoolId=${session.user.schoolId}`)
        if (!gradeLevelsResponse.ok) throw new Error('Failed to fetch grade levels')
        const gradeLevelsData = await gradeLevelsResponse.json()
        setGradeLevels(gradeLevelsData)

        // Fetch teachers
        const teachersResponse = await fetch(`/api/teachers?schoolId=${session.user.schoolId}`)
        if (!teachersResponse.ok) throw new Error('Failed to fetch teachers')
        const teachersData = await teachersResponse.json()
        setTeachers(teachersData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoadingGradeLevels(false)
        setIsLoadingTeachers(false)
      }
    }

    fetchData()
  }, [session?.user?.schoolId])

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
          name="teachers.0"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Class Teacher</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a class teacher" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingTeachers ? (
                    <SelectItem value="loading" disabled>Loading teachers...</SelectItem>
                  ) : teachers.length === 0 ? (
                    <SelectItem value="none" disabled>No teachers found</SelectItem>
                  ) : (
                    teachers.map((teacher) => (
                      <SelectItem 
                        key={teacher._id} 
                        value={teacher._id}
                      >
                        {teacher.firstName} {teacher.lastName} ({teacher.teacherId})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a grade level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingGradeLevels ? (
                    <SelectItem value="loading" disabled>Loading grade levels...</SelectItem>
                  ) : gradeLevels.length === 0 ? (
                    <SelectItem value="none" disabled>No grade levels found</SelectItem>
                  ) : (
                    gradeLevels.map((gradeLevel) => (
                      <SelectItem 
                        key={gradeLevel._id} 
                        value={gradeLevel._id}
                      >
                        {gradeLevel.name} ({gradeLevel.code})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
