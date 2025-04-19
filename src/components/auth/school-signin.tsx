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
import { Eye, EyeOff, School, User, Mail, Lock } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  schoolId: z.string().min(1, 'Please select a school'),
  userType: z.enum(['student', 'teacher', 'principal', 'staff', 'parent'], {
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
      setLoading(true)
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
      } finally {
        setLoading(false)
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
        case 'staff':
          router.push('/dashboard/staff')
          break
        case 'parent':
          router.push('/dashboard/children')
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
    <div className="w-full">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-100">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {loading && !schools.length ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">School</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/50 border-blue-200 hover:border-blue-300 transition-colors">
                          <School className="w-4 h-4 mr-2 text-blue-600" />
                          <SelectValue placeholder="Select a school" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map((school) => (
                          <SelectItem key={school._id} value={school._id}>
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
                    <FormLabel className="text-gray-700">I am a</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/50 border-blue-200 hover:border-blue-300 transition-colors">
                          <User className="w-4 h-4 mr-2 text-blue-600" />
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                        <SelectItem value="parent">Parent/Guardian</SelectItem>
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
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600" />
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          className="pl-10 bg-white/50 border-blue-200 hover:border-blue-300 transition-colors" 
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600" />
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="pl-10 bg-white/50 border-blue-200 hover:border-blue-300 transition-colors"
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

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-200 py-6"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  )
}
