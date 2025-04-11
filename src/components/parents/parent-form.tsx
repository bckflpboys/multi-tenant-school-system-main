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
import { parentFormSchema, type ParentFormValues } from "@/lib/validations/parent"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ParentFormProps {
  initialData?: ParentFormValues
  onSubmit: (data: ParentFormValues) => void
  isLoading?: boolean
}

export function ParentForm({ initialData, onSubmit, isLoading }: ParentFormProps) {
  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: initialData ?? {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      alternativePhoneNumber: "",
      address: "",
      occupation: "",
      governmentId: "",
      relationshipToStudent: "",
      studentIds: [],
      emergencyContact: "",
      medicalInfo: "",
    },
  })

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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="Enter email address (optional)" 
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
            </div>

            <FormField
              control={form.control}
              name="alternativePhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Alternative Phone Number</FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      placeholder="Enter alternative phone number (optional)" 
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
              name="governmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Government ID Number</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter national ID or passport number (optional)" 
                      {...field}
                      className="h-11 border-gray-300 focus:border-gray-400"
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
            <CardTitle className="text-lg font-medium text-gray-900">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Occupation</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter occupation (optional)" 
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
              name="relationshipToStudent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Relationship to Student</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter relationship (e.g., Father, Mother, Guardian)" 
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
              name="studentIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Student School IDs</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter student school IDs (comma separated)" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                      className="h-11 border-gray-300 focus:border-gray-400"
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
            {isLoading ? "Creating..." : "Create Parent"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
