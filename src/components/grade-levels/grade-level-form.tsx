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
import { gradeLevelFormSchema, type GradeLevelFormValues } from "@/lib/validations/grade-level"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface GradeLevelFormProps {
  initialData?: GradeLevelFormValues
  onSubmit: (data: GradeLevelFormValues) => void
  isLoading?: boolean
}

export function GradeLevelForm({ initialData, onSubmit, isLoading }: GradeLevelFormProps) {
  const form = useForm<GradeLevelFormValues>({
    resolver: zodResolver(gradeLevelFormSchema),
    defaultValues: initialData ?? {
      name: "",
      code: "",
      description: "",
      capacity: 0,
      headTeacherId: "",
      subjects: [],
      fees: 0,
    },
  })

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
                  <FormLabel className="text-gray-700">Head Teacher</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter head teacher ID (optional)" 
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
              name="subjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Subjects</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter subject IDs (comma-separated)" 
                      value={field.value.join(", ")}
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
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium px-8 py-2.5"
          >
            {isLoading ? "Creating..." : "Create Grade Level"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
