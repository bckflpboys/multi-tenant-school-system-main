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
import { lessonFormSchema, type LessonFormValues } from "@/lib/validations/lesson"
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

interface Subject {
  _id: string
  name: string
  code: string
  description?: string
}

interface Class {
  _id: string
  name: string
  grade: string
  academicYear: string
}

interface LessonFormProps {
  initialData?: LessonFormValues
  onSubmit: (data: LessonFormValues) => void
  isLoading?: boolean
}

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
]

export function LessonForm({ initialData, onSubmit, isLoading }: LessonFormProps) {
  const { data: session } = useSession()
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [isLoadingGradeLevels, setIsLoadingGradeLevels] = useState(true)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)

  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: initialData ?? {
      title: "",
      description: "",
      subjectId: "",
      teacherId: "",
      gradeLevelId: "",
      startTime: "",
      endTime: "",
      dayOfWeek: "monday",
      room: "",
      class: "",
      materials: [],
      notes: "",
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

    const fetchClasses = async () => {
      if (!session?.user?.schoolId) return
      
      try {
        setIsLoadingClasses(true)
        const response = await fetch(`/api/classes?schoolId=${session.user.schoolId}`)
        if (!response.ok) throw new Error('Failed to fetch classes')
        const data = await response.json()
        setClasses(data)
      } catch (error) {
        console.error('Error fetching classes:', error)
      } finally {
        setIsLoadingClasses(false)
      }
    }

    fetchGradeLevels()
    fetchTeachers()
    fetchSubjects()
    fetchClasses()
  }, [session?.user?.schoolId])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Lesson Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Lesson Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter lesson title" 
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
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Day of Week</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-gray-400">
                          <SelectValue placeholder="Select a day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </SelectItem>
                        ))}
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
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Start Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="time"
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
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">End Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="time"
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Subject</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-gray-400">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingSubjects ? (
                          <SelectItem value="loading" disabled>Loading subjects...</SelectItem>
                        ) : subjects.length === 0 ? (
                          <SelectItem value="none" disabled>No subjects found</SelectItem>
                        ) : (
                          subjects.map((subject) => (
                            <SelectItem key={subject._id} value={subject._id}>
                              {subject.name} ({subject.code})
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
                name="teacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Teacher</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-gray-400">
                          <SelectValue placeholder="Select a teacher" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingTeachers ? (
                          <SelectItem value="loading" disabled>Loading teachers...</SelectItem>
                        ) : teachers.length === 0 ? (
                          <SelectItem value="none" disabled>No teachers found</SelectItem>
                        ) : (
                          teachers.map((teacher) => (
                            <SelectItem key={teacher._id} value={teacher._id}>
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
                name="gradeLevelId"
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
                            <SelectItem key={gradeLevel._id} value={gradeLevel._id}>
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
                name="room"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Room</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter room number/name (optional)" 
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
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-gray-400">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingClasses ? (
                          <SelectItem value="loading" disabled>Loading classes...</SelectItem>
                        ) : classes.length === 0 ? (
                          <SelectItem value="none" disabled>No classes found</SelectItem>
                        ) : (
                          classes.map((classItem) => (
                            <SelectItem key={classItem._id} value={classItem._id}>
                              {classItem.name} - <span className="font-bold">Grade {classItem.grade}</span> ({classItem.academicYear})
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

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter lesson description (optional)"
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional notes (optional)"
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
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Materials</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter materials (comma-separated)" 
                      value={field.value?.join(", ") || ""}
                      onChange={(e) => field.onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                      className="h-11 border-gray-300 focus:border-gray-400"
                    />
                  </FormControl>
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
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-8 py-2.5"
          >
            {isLoading ? "Creating..." : "Create Lesson"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
