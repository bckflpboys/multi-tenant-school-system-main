'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaCalendarAlt, 
  FaArrowLeft,
  FaEdit,
  FaTrash
} from 'react-icons/fa'

interface School {
  _id: string
  name: string
  email: string
  address: string
  phone: string
  website?: string
  description?: string
  principalName: string
  principalEmail: string
  subscription: {
    tier: 'basic' | 'standard'
    features: Record<string, boolean>
    aiFeatures: string[]
  }
  stats: {
    users: number
    classes: number
    subjects: number
  }
  createdAt: string
  updatedAt: string
}

export default function SchoolDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        console.log('Fetching school details for ID:', params.id);
        const response = await fetch(`/api/schools/${params.id}`)
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Failed to fetch school details')
        }
        const data = await response.json()
        setSchool(data.school)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSchoolDetails()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !school) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="text-red-500 mb-4">{error || 'Failed to load school details'}</div>
        <Button onClick={() => router.back()} variant="outline">
          <FaArrowLeft className="mr-2" /> Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button onClick={() => router.back()} variant="outline" className="mb-4">
            <FaArrowLeft className="mr-2" /> Back to Schools
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{school.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FaEdit className="mr-2" /> Edit
          </Button>
          <Button variant="destructive">
            <FaTrash className="mr-2" /> Delete
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <span>{school.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-500" />
              <span>{school.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-500" />
              <span>{school.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-500" />
              <span>Created: {new Date(school.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>School Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{school.stats.users}</div>
                <div className="text-gray-600">Total Users</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{school.stats.classes}</div>
                <div className="text-gray-600">Total Classes</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{school.stats.subjects}</div>
                <div className="text-gray-600">Total Subjects</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
