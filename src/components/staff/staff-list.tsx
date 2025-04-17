'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaUserTie, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaBuilding, FaBriefcase } from 'react-icons/fa'
import { useSession } from "next-auth/react"

interface Staff {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  staffId: string
  department: string
  position: string
  employmentType: string
  joiningDate: string
  governmentId: string
  address?: string
  createdAt: string
  emergencyContact?: string
}

export function StaffList() {
  const { data: session } = useSession()
  const [staff, setStaff] = useState<Staff[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        if (session?.user?.schoolId) {
          const response = await fetch(`/api/staff?schoolId=${session.user.schoolId}`)
          if (!response.ok) throw new Error('Failed to fetch staff')
          const data = await response.json()
          setStaff(data)
        }
      } catch (error) {
        console.error('Error fetching staff:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStaff()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (staff.length === 0) {
    return (
      <p className="text-gray-500 text-center">No staff members found. Add your first staff member to get started.</p>
    )
  }

  const getEmploymentTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'part-time':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'contract':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'temporary':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {staff.map((member) => (
        <Card 
          key={member._id} 
          className="bg-gradient-to-br from-blue-100 to-indigo-100 border-[1px] border-gray-200 hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                  <FaUserTie className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {member.firstName} {member.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaIdCard className="h-4 w-4 text-blue-500" />
                    ID: {member.staffId}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <FaBriefcase className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <div className="font-medium">Position Information</div>
                    <div>{member.position}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <FaBuilding className="h-4 w-4 text-blue-500" />
                      {member.department}
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded-md text-sm border ${getEmploymentTypeColor(member.employmentType)}`}>
                        {member.employmentType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2">
                  <FaEnvelope className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <div className="font-medium">Contact Information</div>
                    <div>{member.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <FaPhone className="h-4 w-4 text-blue-500" />
                      {member.phoneNumber}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardContent className="py-4 flex flex-col justify-center md:border-l border-blue-200/50">
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                  <span>Joined: {new Date(member.joiningDate).toLocaleDateString()}</span>
                </div>
                {member.governmentId && (
                  <div className="flex items-center gap-2">
                    <FaIdCard className="h-4 w-4 text-blue-500" />
                    <span>Gov ID: {member.governmentId}</span>
                  </div>
                )}
                {member.emergencyContact && (
                  <div className="text-gray-700 text-sm mt-2">
                    <span className="font-medium">Emergency Contact:</span>
                    <p className="mt-1">{member.emergencyContact}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
