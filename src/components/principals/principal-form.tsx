"use client"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { principalFormSchema, type PrincipalFormValues } from "@/lib/validations/principal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { Wand2, Eye, EyeOff } from "lucide-react"

interface PrincipalFormProps {
  initialData?: PrincipalFormValues
  onSubmit: (data: PrincipalFormValues) => void
  isLoading?: boolean
}

export function PrincipalForm({ initialData, onSubmit, isLoading }: PrincipalFormProps) {
  const [schools, setSchools] = useState<Array<{ _id: string; name: string }>>([])
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<PrincipalFormValues>({
    resolver: zodResolver(principalFormSchema),
    defaultValues: initialData ?? {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "male",
      address: "",
      governmentId: "",
      employeeId: "",
      qualifications: "",
      yearsOfExperience: "",
      emergencyContact: "",
      assignedSchool: "",
      startDate: "",
      contractDetails: "",
    },
  })

  // Function to generate a strong password
  const generatePassword = () => {
    const length = 12
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      password += charset[randomIndex]
    }
    form.setValue("password", password)
    // Copy to clipboard
    navigator.clipboard.writeText(password)
    toast.success("Password generated and copied to clipboard!")
  }

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools')
        const data = await response.json()
        setSchools(data.schools)
      } catch (error) {
        console.error('Error fetching schools:', error)
        toast.error('Failed to load schools')
      }
    }
    fetchSchools()
  }, [])

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
                    <FormLabel className="text-gray-700">First Name *</FormLabel>
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
                    <FormLabel className="text-gray-700">Last Name *</FormLabel>
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
                    <FormLabel className="text-gray-700">Gender *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white text-gray-900 border-gray-300 focus:border-gray-400">
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

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email Address *</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter email address" 
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
                    <FormLabel className="text-gray-700">Password *</FormLabel>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password" 
                            {...field}
                            className="h-11 border-gray-300 focus:border-gray-400 pr-10"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-0 top-0 h-11 w-11 px-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 px-3 bg-blue-500 hover:bg-blue-600 text-white border-blue-500 hover:border-blue-600"
                        onClick={generatePassword}
                      >
                        <Wand2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
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
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Emergency Contact</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter emergency contact" 
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter address" 
                      {...field}
                      className="min-h-[100px] border-gray-300 focus:border-gray-400"
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
            <CardTitle className="text-lg font-medium text-gray-900">Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Employee ID *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter employee ID" 
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
                name="governmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Government ID *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter government ID" 
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
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Qualifications *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter qualifications" 
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
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Years of Experience *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="Enter years of experience" 
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
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Start Date *</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
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
                name="assignedSchool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Assigned School *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11 bg-white text-gray-900 border-gray-300 focus:border-gray-400">
                          <SelectValue placeholder="Select a school" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school._id} value={school._id} className="text-gray-900">
                            {school.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contractDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Contract Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter contract details" 
                      {...field}
                      className="min-h-[100px] border-gray-300 focus:border-gray-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Principal"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
