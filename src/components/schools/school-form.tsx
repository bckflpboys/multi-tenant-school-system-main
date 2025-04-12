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
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { FEATURES } from "@/types/permissions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

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
  }).optional(),
  description: z.string().optional(),
  subscription: z.object({
    tier: z.enum(['basic', 'standard', 'premium', 'enterprise']),
    features: z.record(z.boolean()),
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
  subscription: {
    tier: "basic",
    features: Object.keys(FEATURES).reduce((acc, key) => {
      acc[key] = FEATURES[key].tier === 'basic';
      return acc;
    }, {} as Record<string, boolean>),
  },
}

const tierColors = {
  basic: "bg-gray-100 text-gray-700",
  standard: "bg-blue-100 text-blue-700",
  premium: "bg-purple-100 text-purple-700",
  enterprise: "bg-indigo-100 text-indigo-700",
}

export function SchoolForm() {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium' | 'enterprise'>('basic')
  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolFormSchema),
    defaultValues,
  })

  const handleTierChange = (tier: 'basic' | 'standard' | 'premium' | 'enterprise') => {
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
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter school email" type="email" className="bg-white" {...field} />
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
              
              <FormField
                control={form.control}
                name="subscription.tier"
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-gray-700">Subscription Tier</FormLabel>
                    <Select
                      onValueChange={(value: 'basic' | 'standard' | 'premium' | 'enterprise') => handleTierChange(value)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white text-gray-900 border-gray-300">
                          <SelectValue placeholder="Select a subscription tier" className="text-gray-900" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="basic" className="text-gray-900">Basic</SelectItem>
                        <SelectItem value="standard" className="text-gray-900">Standard</SelectItem>
                        <SelectItem value="premium" className="text-gray-900">Premium</SelectItem>
                        <SelectItem value="enterprise" className="text-gray-900">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-gray-600">
                      Select the subscription tier for this school. This will determine which features are available.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Available Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(FEATURES).map(([key, feature]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`subscription.features.${key}`}
                      render={({ field }) => (
                        <div className={`p-4 rounded-lg border-2 ${
                          getTierLevel(feature.tier) <= getTierLevel(selectedTier)
                            ? 'bg-white border-gray-200 hover:border-gray-300'
                            : 'bg-gray-50 border-gray-100'
                        }`}>
                          <FormItem className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={getTierLevel(feature.tier) > getTierLevel(selectedTier)}
                                  className="rounded-sm"
                                />
                              </FormControl>
                              <div className="flex items-center space-x-2">
                                <FormLabel className="text-gray-900 font-medium">
                                  {feature.name}
                                </FormLabel>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tierColors[feature.tier as keyof typeof tierColors]}`}>
                                  {feature.tier}
                                </span>
                              </div>
                            </div>
                            <FormDescription className="text-gray-600 ml-6">
                              {feature.description}
                            </FormDescription>
                          </FormItem>
                        </div>
                      )}
                    />
                  ))}
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
