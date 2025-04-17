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
import { announcementFormSchema, type AnnouncementFormValues } from "@/lib/validations/announcement"

interface AnnouncementFormProps {
  initialData?: AnnouncementFormValues
  onSubmit: (data: AnnouncementFormValues) => void
  isLoading?: boolean
}

interface GradeLevel {
  _id: string
  name: string
  code: string
}

interface Subject {
  _id: string
  name: string
  code: string
  description?: string
}

const announcementTypes = [
  { value: "general", label: "General" },
  { value: "academic", label: "Academic" },
  { value: "event", label: "Event" },
  { value: "emergency", label: "Emergency" },
]

const targetAudiences = [
  { value: "all", label: "All" },
  { value: "students", label: "Students" },
  { value: "teachers", label: "Teachers" },
  { value: "parents", label: "Parents" },
  { value: "staff", label: "Staff" },
]

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

export function AnnouncementForm({
  initialData,
  onSubmit,
  isLoading = false,
}: AnnouncementFormProps) {
  const { data: session } = useSession()
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoadingGradeLevels, setIsLoadingGradeLevels] = useState(false)
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "general",
      targetAudience: ["all"],
      priority: "medium",
      startDate: new Date().toISOString().split('T')[0],
      gradeLevelIds: [],
      subjectIds: [],
      ...initialData,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [form, initialData])

  // Fetch grade levels
  useEffect(() => {
    const fetchGradeLevels = async () => {
      setIsLoadingGradeLevels(true)
      try {
        const response = await fetch(`/api/grade-levels?schoolId=${session?.user?.schoolId}`)
        if (!response.ok) throw new Error('Failed to fetch grade levels')
        const data = await response.json()
        setGradeLevels(data)
      } catch (error) {
        console.error('Error fetching grade levels:', error)
      } finally {
        setIsLoadingGradeLevels(false)
      }
    }

    if (session?.user?.schoolId) {
      fetchGradeLevels()
    }
  }, [session])

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoadingSubjects(true)
      try {
        const response = await fetch(`/api/subjects?schoolId=${session?.user?.schoolId}`)
        if (!response.ok) throw new Error('Failed to fetch subjects')
        const data = await response.json()
        setSubjects(data)
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setIsLoadingSubjects(false)
      }
    }

    if (session?.user?.schoolId) {
      fetchSubjects()
    }
  }, [session])

  const handleSubmit = () => {
    const formData = form.getValues();
    console.log('Submitting form with data:', formData);
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <div className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter announcement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter announcement content"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {announcementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black font-medium">End Date (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    min={form.getValues("startDate") || new Date().toISOString().split('T')[0]}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">Target Audience</FormLabel>
              <div className="flex flex-wrap gap-2">
                {targetAudiences.map((audience) => (
                  <Button
                    key={audience.value}
                    type="button"
                    variant={field.value?.includes(audience.value as "all" | "students" | "teachers" | "parents" | "staff") ? "default" : "outline"}
                    onClick={() => {
                      const currentValue = field.value || []
                      const newValue = currentValue.includes(audience.value as "all" | "students" | "teachers" | "parents" | "staff")
                        ? currentValue.filter((v) => v !== audience.value)
                        : [...currentValue, audience.value]
                      field.onChange(newValue)
                    }}
                  >
                    {audience.label}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gradeLevelIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">Grade Levels (Optional)</FormLabel>
              <div className="flex flex-wrap gap-2">
                {isLoadingGradeLevels ? (
                  <div>Loading...</div>
                ) : (
                  gradeLevels.map((gradeLevel) => (
                    <Button
                      key={gradeLevel._id}
                      type="button"
                      variant={field.value?.includes(gradeLevel._id) ? "default" : "outline"}
                      onClick={() => {
                        const currentValue = field.value || []
                        const newValue = currentValue.includes(gradeLevel._id)
                          ? currentValue.filter((v) => v !== gradeLevel._id)
                          : [...currentValue, gradeLevel._id]
                        field.onChange(newValue)
                      }}
                    >
                      {gradeLevel.name}
                    </Button>
                  ))
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subjectIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black font-medium">Subjects (Optional)</FormLabel>
              <div className="flex flex-wrap gap-2">
                {isLoadingSubjects ? (
                  <div>Loading...</div>
                ) : (
                  subjects.map((subject) => (
                    <Button
                      key={subject._id}
                      type="button"
                      variant={field.value?.includes(subject._id) ? "default" : "outline"}
                      onClick={() => {
                        const currentValue = field.value || []
                        const newValue = currentValue.includes(subject._id)
                          ? currentValue.filter((v) => v !== subject._id)
                          : [...currentValue, subject._id]
                        field.onChange(newValue)
                      }}
                    >
                      {subject.name}
                    </Button>
                  ))
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Announcement"}
        </Button>
      </div>
    </Form>
  )
}
