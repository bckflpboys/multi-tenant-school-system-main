"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
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
import { Textarea } from "@/components/ui/textarea"
import { teacherFormSchema, type TeacherFormValues } from "@/lib/validations/teacher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface TeacherFormProps {
  initialData?: TeacherFormValues
  onSubmit: (data: TeacherFormValues) => void
  isLoading?: boolean
}

export function TeacherForm({ initialData, onSubmit, isLoading }: TeacherFormProps) {
  const { data: session } = useSession()
  const [schoolSubjects, setSchoolSubjects] = useState<{ id: string; name: string; }[]>([])
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true)

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: initialData ?? {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      email: "",
      phoneNumber: "",
      address: "",
      teacherId: "",
      governmentId: "",
      password: "",
      subjects: [""],
      qualifications: "",
      emergencyContact: "",
      medicalInfo: "",
    },
  })

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoadingSubjects(true)

      if (!session?.user?.schoolId) {
        console.error('No school ID in session')
        setIsLoadingSubjects(false)
        return
      }

      try {
        const response = await fetch(`/api/schools/${session.user.schoolId}/subjects`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          cache: 'no-store', // Prevent caching
          credentials: 'include'
        })
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not OK:', response.status, errorText);
          throw new Error(`Failed to fetch subjects: ${response.status}`);
        }
        
        const data = await response.json()
        if (!Array.isArray(data)) {
          console.error('Invalid subjects data received:', data)
          throw new Error('Invalid subjects data received')
        }
        
        const formattedSubjects = data.map(subject => ({
          id: subject._id,
          name: subject.name
        }))
        
        setSchoolSubjects(formattedSubjects)
      } catch (error) {
        console.error('Error fetching subjects:', error)
        setSchoolSubjects([])
      } finally {
        setIsLoadingSubjects(false)
      }
    }

    if (session?.user?.schoolId) {
      fetchSubjects()
    }
  }, [session])

  const addSubject = () => {
    const currentSubjects = form.getValues("subjects")
    form.setValue("subjects", [...currentSubjects, ""])
  }

  const removeSubject = (index: number) => {
    const currentSubjects = form.getValues("subjects")
    if (currentSubjects.length > 1) {
      form.setValue("subjects", currentSubjects.filter((_, i) => i !== index))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter first name" 
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter last name" 
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Date of Birth</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400 text-gray-900"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white text-gray-900">
                          <SelectValue placeholder="Select gender" className="text-gray-500" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="governmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Government ID Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter national ID or passport number" 
                      {...field}
                      className="h-11 border-gray-300 focus:border-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email Address*</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter teacher email" 
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password*</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input 
                          type="text"
                          placeholder="Enter password or generate" 
                          {...field}
                          className="h-11 border-gray-300 focus:border-gray-400"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="default"
                        className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer whitespace-nowrap"
                        onClick={() => {
                          const govId = form.getValues('governmentId');
                          if (!govId) {
                            alert('Please enter Government ID Number first');
                            return;
                          }
                          const generatedPassword = `@Ccess${govId}`;
                          field.onChange(generatedPassword);
                        }}
                      >
                        Generate Password
                      </Button>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder="Enter phone number" 
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter address (optional)" 
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
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Teacher School ID</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input 
                        placeholder="Enter or generate school ID" 
                        {...field}
                        className="h-11 border-gray-300 focus:border-gray-400"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="default"
                      className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium cursor-pointer"
                      onClick={() => {
                        // Generate a random ID with format: T-YYYY-XXXXX
                        const year = new Date().getFullYear();
                        const random = Math.floor(10000 + Math.random() * 90000);
                        field.onChange(`T-${year}-${random}`);
                      }}
                    >
                      Generate ID
                    </Button>
                  </div>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            
          </CardContent>
        </Card>

        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-gray-700">Subjects</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSubject}
                  className="h-8"
                >
                  Add Subject
                </Button>
              </div>
              
              {form.watch("subjects").map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`subjects.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-11 border-gray-300 focus:border-gray-400">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingSubjects ? (
                                <SelectItem value="loading">Loading subjects...</SelectItem>
                              ) : schoolSubjects.length === 0 ? (
                                <SelectItem value="no_subjects">No subjects available</SelectItem>
                              ) : (
                                schoolSubjects.map((subject) => (
                                  <SelectItem key={subject.id} value={subject.id}>
                                    {subject.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  {form.watch("subjects").length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubject(index)}
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
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Qualifications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter qualifications and certifications"
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

        <Card className="border border-gray-300 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-300">
            <CardTitle className="text-lg font-medium text-gray-900">Emergency & Medical Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Emergency Contact</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter emergency contact number (optional)" 
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
              name="medicalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Medical Information</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any relevant medical information (optional)"
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
            {isLoading ? "Creating..." : "Create Teacher"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
