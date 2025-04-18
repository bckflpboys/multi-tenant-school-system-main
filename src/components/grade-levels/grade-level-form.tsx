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
import { gradeLevelFormSchema, type GradeLevelFormValues } from "@/lib/validations/grade-level"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Subject {
  _id: string
  name: string
  code: string
  description?: string
}

interface Teacher {
  _id: string
  firstName: string
  lastName: string
  email: string
  teacherId: string
}

interface GradeLevelFormProps {
  initialData?: GradeLevelFormValues
  onSubmit: (data: GradeLevelFormValues) => void
  isLoading?: boolean
}

export function GradeLevelForm({ initialData, onSubmit, isLoading }: GradeLevelFormProps) {
  const { data: session } = useSession()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true)

  const form = useForm<GradeLevelFormValues>({
    resolver: zodResolver(gradeLevelFormSchema),
    defaultValues: initialData ?? {
      name: "",
      code: "",
      description: "",
      capacity: 0,
      headTeacherId: [],
      subjects: [],
      fees: 0,
    },
  })

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!session?.user?.schoolId) return
      
      try {
        setIsLoadingSubjects(true)
        const response = await fetch(`/api/subjects?schoolId=${session.user.schoolId}`)
        if (!response.ok) throw new Error('Failed to fetch subjects')
        const data = await response.json()
        setSubjects(data)
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setIsLoadingSubjects(false)
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

    fetchSubjects()
    fetchTeachers()
  }, [session?.user?.schoolId])

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
                        placeholder="Enter grade level name (e.g., Grade 1, Kindergarten 1)" 
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
                        placeholder="Enter grade level code (e.g., G1, K1)" 
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
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Enter maximum capacity (optional)" 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
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
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : 0)}
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
                  <FormLabel className="text-gray-700">Head Teachers</FormLabel>
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
                        data-headteacher-trigger={field.name}
                      >
                        <SelectValue placeholder="Select head teachers" />
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
                      const trigger = document.querySelector(`[data-headteacher-trigger="${field.name}"]`)
                      if (trigger instanceof HTMLElement) {
                        trigger.click()
                      }
                    }}
                    className="mt-2 text-green-600 border-green-600 hover:bg-green-50"
                  >
                    + Add Another Head Teacher
                  </Button>
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
                  <Select 
                    onValueChange={(value) => {
                      const currentSubjects = new Set(field.value)
                      if (currentSubjects.has(value)) {
                        currentSubjects.delete(value)
                      } else {
                        currentSubjects.add(value)
                      }
                      field.onChange(Array.from(currentSubjects))
                    }}
                    value={field.value[field.value.length - 1] || ""}
                  >
                    <FormControl>
                      <SelectTrigger 
                        className="h-11 border-gray-300 focus:border-gray-400"
                        data-subject-trigger={field.name}
                      >
                        <SelectValue placeholder="Select subjects" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingSubjects ? (
                        <SelectItem value="loading" disabled>Loading subjects...</SelectItem>
                      ) : subjects.length === 0 ? (
                        <SelectItem value="none" disabled>No subjects found</SelectItem>
                      ) : (
                        subjects.map((subject) => (
                          <SelectItem 
                            key={subject._id} 
                            value={subject._id}
                            className={field.value.includes(subject._id) ? "bg-gray-100" : ""}
                          >
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {field.value.map((subjectId) => {
                      const subject = subjects.find(s => s._id === subjectId)
                      return subject ? (
                        <div 
                          key={subject._id} 
                          className="bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm flex items-center gap-1"
                        >
                          <span>{subject.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newSubjects = field.value.filter(id => id !== subject._id)
                              field.onChange(newSubjects)
                            }}
                            className="text-orange-600 hover:text-orange-800"
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
                      const trigger = document.querySelector(`[data-subject-trigger="${field.name}"]`)
                      if (trigger instanceof HTMLElement) {
                        trigger.click()
                      }
                    }}
                    className="mt-2 text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    + Add Another Subject
                  </Button>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-8 py-2.5"
          >
            {isLoading ? "Creating..." : "Create Grade Level"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
