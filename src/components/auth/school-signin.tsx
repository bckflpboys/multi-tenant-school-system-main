'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  schoolId: z.string().min(1, 'Please select a school'),
  userType: z.enum(['student', 'teacher', 'principal'], {
    required_error: 'Please select a user type',
  }),
})

type FormData = z.infer<typeof formSchema>

export function SchoolSignIn() {
  const router = useRouter()
  const [schools, setSchools] = useState<Array<{ _id: string; name: string }>>([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      schoolId: '',
      userType: 'student',
    },
  })

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        if (Array.isArray(data.schools)) {
          setSchools(data.schools)
        } else {
          console.error('Unexpected data format:', data)
          toast.error('Invalid data format received from server')
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
        toast.error('Failed to load schools')
      }
    }
    fetchSchools()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        schoolId: data.schoolId,
        userType: data.userType,
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (!result?.ok) {
        toast.error(result?.error || 'Failed to sign in')
        return
      }

      toast.success('Signed in successfully')
      
      // Redirect based on user type
      switch (data.userType) {
        case 'principal':
          router.push('/dashboard/schools')
          break
        case 'teacher':
          router.push('/dashboard/classes')
          break
        case 'student':
          router.push('/dashboard/courses')
          break
        default:
          router.push('/dashboard')
      }

    } catch (error) {
      console.error('Sign in error:', error)
      toast.error('Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <p className="text-gray-500">Enter your credentials to access your account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="schoolId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-gray-900">
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-gray-900">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student" className="text-gray-900">Student</SelectItem>
                    <SelectItem value="teacher" className="text-gray-900">Teacher</SelectItem>
                    <SelectItem value="principal" className="text-gray-900">Principal</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter your password" 
                      {...field} 
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
