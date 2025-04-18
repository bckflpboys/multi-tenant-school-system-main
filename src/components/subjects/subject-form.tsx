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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjectFormSchema, type SubjectFormValues } from "@/lib/validations/subject"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

interface SubjectFormProps {
  initialData?: SubjectFormValues
  onSubmit: (data: SubjectFormValues) => void
  isLoading?: boolean
}

export function SubjectForm({ initialData, onSubmit, isLoading }: SubjectFormProps) {
  const { data: session } = useSession()
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [isLoadingGradeLevels, setIsLoadingGradeLevels] = useState(true)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true)

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

  useEffect(() => {
    const fetchGradeLevels = async () => {
      if (!session?.user?.schoolId) return
      
      try {
        setIsLoadingGradeLevels(true)
        const response = await fetch(`/api/grade-levels?schoolId=${session.user.schoolId}`)
        if (!response.ok) throw new Error('Failed to fetch grade levels')
        const data = await response.json()
        setGradeLevels(data)
      } catch (error) {
        console.error('Error fetching grade levels:', error)
      } finally {
        setIsLoadingGradeLevels(false)
      }
    }

    const fetchTeachers = async () => {
      if (!session?.user?.schoolId) return
      
      try {
        setIsLoadingTeachers(true)
        const response = await fetch(`/api/teachers?schoolId=${session.user.schoolId}`)
        if (!response.ok) throw new Error('Failed to fetch teachers')
        const data = await response.json()
        setTeachers(data)
      } catch (error) {
        console.error('Error fetching teachers:', error)
      } finally {
        setIsLoadingTeachers(false)
      }
    }

    fetchGradeLevels()
    fetchTeachers()
  }, [session?.user?.schoolId])

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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-gray-400">
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
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="headTeacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Head Teacher</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-gray-400">
                          <SelectValue placeholder="Select head teacher" />
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
                  <Select 
                    onValueChange={(value) => {
                      const currentTeachers = new Set(field.value)
                      if (currentTeachers.has(value)) {
                        currentTeachers.delete(value)
                      } else {
                        currentTeachers.add(value)
                      }
                      field.onChange(Array.from(currentTeachers))
                    }}
                    value={field.value[field.value.length - 1] || ""}
                  >
                    <FormControl>
                      <SelectTrigger 
                        className="h-11 border-gray-300 focus:border-gray-400"
                        data-teacher-trigger={field.name}
                      >
                        <SelectValue placeholder="Select teachers" />
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
                            className={field.value.includes(teacher._id) ? "bg-gray-100" : ""}
                          >
                            {teacher.firstName} {teacher.lastName} ({teacher.teacherId})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value.map((teacherId) => {
                      const teacher = teachers.find(t => t._id === teacherId)
                      return teacher ? (
                        <div 
                          key={teacher._id} 
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          <span>{teacher.firstName} {teacher.lastName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newTeachers = field.value.filter(id => id !== teacher._id)
                              field.onChange(newTeachers)
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const trigger = document.querySelector(`[data-teacher-trigger="${field.name}"]`)
                      if (trigger instanceof HTMLElement) {
                        trigger.click()
                      }
                    }}
                    className="mt-2 text-green-600 border-green-600 hover:bg-green-50"
                  >
                    + Add Another Teacher
                  </Button>
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
