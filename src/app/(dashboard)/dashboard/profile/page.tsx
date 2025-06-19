'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Pencil, Mail, Phone, MapPin, Building2, Shield, Calendar } from "lucide-react"
import { useSession } from "next-auth/react"

interface UserData {
  id: string
  name: string
  email: string
  userType: 'super-admin' | 'student' | 'teacher' | 'principal'
  schoolId: string
  schoolName?: string
  createdAt?: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) throw new Error('Failed to fetch user data')
        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 -left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto py-6 sm:py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Profile</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>
          <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview Card */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 blur-2xl opacity-20 rounded-full transform -rotate-6"></div>
                  <Avatar className="relative h-24 w-24 sm:h-32 sm:w-32 border-4 border-white shadow-xl">
                    {session?.user?.image ? (
                      <AvatarImage src={session.user.image} alt={user?.name || ""} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl sm:text-3xl font-semibold text-white">
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{user?.name}</h2>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {user?.userType}
                      </span>
                      {user?.schoolName && (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-sm font-medium bg-white text-gray-700 border border-gray-200 shadow-lg">
                          <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          {user.schoolName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 mt-4 sm:mt-6">
                    <div className="flex items-center gap-3 text-gray-700 bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 text-sm sm:text-base">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{user?.email}</span>
                    </div>
                    {user?.phoneNumber && (
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 text-sm sm:text-base">
                        <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{user.phoneNumber}</span>
                      </div>
                    )}
                    {user?.address && (
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 text-sm sm:text-base">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">{user.address}</span>
                      </div>
                    )}
                    {user?.createdAt && (
                      <div className="flex items-center gap-3 text-gray-700 bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 text-sm sm:text-base">
                        <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                        <span className="truncate">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Academic Information */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600">Student ID</p>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-semibold">STU-{user?.id?.slice(-6)}</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600">Grade/Year</p>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-semibold">Grade 10</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600">Class</p>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-semibold">10-A</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600">Academic Year</p>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-semibold">2023-2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600">Email Address</p>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-semibold truncate">{user?.email}</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600">Phone Number</p>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-semibold">{user?.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                    <p className="text-xs sm:text-sm font-medium text-blue-600">Address</p>
                    <p className="mt-1 text-sm sm:text-base text-gray-900 font-semibold">{user?.address || 'Not provided'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
