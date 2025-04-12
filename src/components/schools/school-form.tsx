"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import toast from "react-hot-toast"
import { FEATURES, Feature } from "@/types/permissions"

const schoolFormSchema = z.object({
  name: z.string().min(2, {
    message: "School name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  website: z.string().url({
    message: "Please enter a valid website URL.",
  }).or(z.literal('')).optional(),
  description: z.string().optional(),
  principalName: z.string().min(2, {
    message: "Principal name must be at least 2 characters.",
  }),
  principalEmail: z.string().email({
    message: "Please enter a valid principal email address.",
  }),
  subscription: z.object({
    tier: z.enum(['basic', 'standard']),
    features: z.record(z.boolean()),
    aiFeatures: z.array(z.enum(['teacher_ai', 'student_ai'])).optional(),
  }),
})

type SchoolFormValues = z.infer<typeof schoolFormSchema>

const defaultValues: Partial<SchoolFormValues> = {
  name: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  description: "",
  principalName: "",
  principalEmail: "",
  subscription: {
    tier: "basic",
    features: Object.keys(FEATURES).reduce((acc, key) => {
      acc[key] = FEATURES[key].tier === 'basic';
      return acc;
    }, {} as Record<string, boolean>),
    aiFeatures: [],
  },
}

const tierColors = {
  basic: "bg-gray-100 text-gray-700",
  standard: "bg-blue-100 text-blue-700",
}

const aiFeatureColors = {
  teacher_ai: "bg-purple-100 text-purple-700 border-purple-200",
  student_ai: "bg-indigo-100 text-indigo-700 border-indigo-200"
}

const aiFeatures = {
  teacher_ai: {
    name: "Teacher AI Features",
    price: "R8,000",
    features: [
      "Auto create AI video explainers",
      "Plagiarism checkers",
      "Custom learning style for students",
      "Create automatic weekly quizzes",
      "Lesson plan generator",
      "Performance predictions"
    ]
  },
  student_ai: {
    name: "Student AI Features",
    price: "R15,000",
    features: [
      "Online AI tutor",
      "Smart alerts (performance decline notifications)"
    ]
  }
}

export function SchoolForm() {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard'>('basic')
  const [teacherAIEnabled, setTeacherAIEnabled] = useState(false)
  const [studentAIEnabled, setStudentAIEnabled] = useState(false)
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues,
  })

  const handleTierChange = (tier: 'basic' | 'standard') => {
    setSelectedTier(tier)
    const newFeatures = Object.keys(FEATURES).reduce((acc, key) => {
      const featureTierLevel = getTierLevel(FEATURES[key].tier)
      const selectedTierLevel = getTierLevel(tier)
      acc[key] = featureTierLevel <= selectedTierLevel
      return acc
    }, {} as Record<string, boolean>)

    form.setValue('subscription.tier', tier)
    form.setValue('subscription.features', newFeatures)
  }

  const getTierLevel = (tier: string): number => {
    const levels = {
      basic: 1,
      standard: 2,
      premium: 3,
      enterprise: 4,
    }
    return levels[tier as keyof typeof levels] || 1
  }

  async function onSubmit(data: SchoolFormValues) {
    try {
      const response = await fetch("/api/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create school")
      }

      toast.success("School has been created successfully.")
      form.reset()
    } catch (error) {
      console.error("Error creating school:", error)
      toast.error("Failed to create school. Please try again.")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* School Information Section */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900">School Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">School Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school name" className="bg-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">School Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school email" type="email" className="bg-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="principalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Principal Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter principal's name" 
                        className="bg-white" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="principalEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Principal Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter principal's email" 
                        type="email" 
                        className="bg-white" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" className="bg-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school website" type="url" className="bg-white" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter school address" className="bg-white" {...field} />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter school description"
                          className="resize-none bg-white h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="border rounded-lg p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription & Features</h3>
              
              <div className="space-y-8">
                {/* Main Subscription Section */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Main Subscription</h4>
                  <FormField
                    control={form.control}
                    name="subscription.tier"
                    render={({ field }) => (
                      <FormItem className="mb-6">
                        <Select
                          onValueChange={(value: 'basic' | 'standard') => handleTierChange(value)}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={`w-full ${tierColors[field.value]}`}>
                              <SelectValue placeholder="Select a subscription tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="basic" className="text-gray-900">Basic</SelectItem>
                            <SelectItem value="standard" className="text-gray-900">Standard</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg border-2 transition-colors ${
                      selectedTier === 'basic' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h5 className="font-medium text-sm mb-2">Basic Features:</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {Object.entries(FEATURES)
                          .filter(([, feature]) => feature.tier === 'basic')
                          .map(([key, feature]) => (
                            <li key={key} className={`text-sm ${
                              selectedTier === 'basic' ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {feature.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className={`p-6 rounded-lg border-2 transition-colors ${
                      selectedTier === 'standard' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h5 className="font-medium text-sm mb-2">Standard Features:</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {Object.entries(FEATURES)
                          .filter(([, feature]) => feature.tier === 'standard')
                          .map(([key, feature]) => (
                            <li key={key} className={`text-sm ${
                              selectedTier === 'standard' ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                              {feature.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI Features Section */}
                <div className="border-t pt-8">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Extra AI Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Teacher AI Card */}
                    <div className={`p-6 rounded-lg border-2 transition-colors ${
                      teacherAIEnabled ? aiFeatureColors.teacher_ai : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h5 className="font-medium text-gray-900">{aiFeatures.teacher_ai.name}</h5>
                          <p className="text-sm font-medium text-gray-600">{aiFeatures.teacher_ai.price}</p>
                        </div>
                        <Switch
                          checked={teacherAIEnabled}
                          onCheckedChange={setTeacherAIEnabled}
                          className={`${teacherAIEnabled ? 'bg-purple-600' : 'bg-gray-200'}`}
                        />
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {aiFeatures.teacher_ai.features.map((feature, index) => (
                          <li key={index} className={`text-sm ${teacherAIEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Student AI Card */}
                    <div className={`p-6 rounded-lg border-2 transition-colors ${
                      studentAIEnabled ? aiFeatureColors.student_ai : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h5 className="font-medium text-gray-900">{aiFeatures.student_ai.name}</h5>
                          <p className="text-sm font-medium text-gray-600">{aiFeatures.student_ai.price}</p>
                        </div>
                        <Switch
                          checked={studentAIEnabled}
                          onCheckedChange={setStudentAIEnabled}
                          className={`${studentAIEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                        />
                      </div>
                      <ul className="list-disc pl-5 space-y-1">
                        {aiFeatures.student_ai.features.map((feature, index) => (
                          <li key={index} className={`text-sm ${studentAIEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Available Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.entries(FEATURES) as [string, Feature][])
                    .filter(([, feature]) => 
                      feature.tier === 'basic' || 
                      feature.tier === 'standard' ||
                      (teacherAIEnabled && feature.tier === 'teacher_ai') ||
                      (studentAIEnabled && feature.tier === 'student_ai')
                    )
                    .map(([key, feature]) => {
                      const isEnabled = 
                        getTierLevel(feature.tier) <= getTierLevel(selectedTier) ||
                        (feature.tier === 'teacher_ai' && teacherAIEnabled) ||
                        (feature.tier === 'student_ai' && studentAIEnabled);

                      // Determine card styling based on feature type
                      let cardStyle = '';
                      if (isEnabled) {
                        if (feature.tier === 'teacher_ai') {
                          cardStyle = 'bg-purple-50 border-purple-200 hover:border-purple-300';
                        } else if (feature.tier === 'student_ai') {
                          cardStyle = 'bg-indigo-50 border-indigo-200 hover:border-indigo-300';
                        } else {
                          cardStyle = 'bg-green-50 border-green-200 hover:border-green-300';
                        }
                      } else {
                        cardStyle = 'bg-gray-50 border-gray-200';
                      }

                      // Determine badge styling
                      let badgeStyle = '';
                      if (isEnabled) {
                        if (feature.tier === 'teacher_ai') {
                          badgeStyle = 'bg-purple-100 text-purple-700';
                        } else if (feature.tier === 'student_ai') {
                          badgeStyle = 'bg-indigo-100 text-indigo-700';
                        } else if (feature.tier === 'basic') {
                          badgeStyle = 'bg-green-100 text-green-700';
                        } else {
                          badgeStyle = 'bg-blue-100 text-blue-700';
                        }
                      } else {
                        badgeStyle = 'bg-gray-100 text-gray-600';
                      }

                      return (
                        <div
                          key={key}
                          className={`p-4 rounded-lg border-2 transition-colors ${cardStyle}`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className={`font-medium ${isEnabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                  {feature.name}
                                </h5>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs ${badgeStyle} px-2 py-0.5 rounded-full`}>
                                    {feature.tier.replace('_', ' ')}
                                  </span>
                                  {(feature.tier === 'teacher_ai' || feature.tier === 'student_ai') && (
                                    <span className="text-xs text-gray-600">
                                      {feature.tier === 'teacher_ai' ? 'R8,000' : 'R15,000'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className={`text-sm ${isEnabled ? 'text-gray-600' : 'text-gray-400'}`}>
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 pt-4 border-t">
          <Button type="submit" className="w-full">
            Create School
          </Button>
        </div>
      </form>
    </Form>
  )
}
