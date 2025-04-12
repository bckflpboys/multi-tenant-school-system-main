'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FaSchool, FaEnvelope, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaArrowRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

interface School {
  _id: string
  name: string
  email: string
  address: string
  phone: string
  createdAt: string
  updatedAt: string
}

export function SchoolsList() {
  const router = useRouter()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('/api/schools')
        if (!response.ok) {
          throw new Error('Failed to fetch schools')
        }
        const data = await response.json()
        setSchools(data.schools)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchSchools()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        Error: {error}
      </div>
    )
  }

  if (schools.length === 0) {
    return (
      <p className="text-gray-500 text-center">No schools found. Add your first school to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {schools.map((school) => (
        <Card 
          key={school._id} 
          className="bg-gradient-to-br from-blue-100 to-indigo-100 border-[1px] border-gray-200 hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                  <FaSchool className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {school.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaEnvelope className="h-4 w-4 text-blue-500" />
                    {school.email}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <FaMapMarkerAlt className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">{school.address}</div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <FaPhone className="h-5 w-5 text-blue-500" />
                  <div className="text-gray-900">{school.phone}</div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <FaCalendarAlt className="h-5 w-5 text-blue-500" />
                  <div className="text-gray-600">
                    {new Date(school.createdAt).toLocaleDateString('en-US', { 
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </CardContent>

            <div className="flex items-center justify-center p-6 md:border-l border-blue-200/50">
              <Button 
                variant="default"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base font-medium px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group flex items-center justify-center gap-2"
                onClick={() => router.push(`/dashboard/schools/${school._id}`)}
              >
                <span>View Details</span>
                <FaArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
