'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaUserFriends, FaEnvelope, FaPhone, FaCalendarAlt, FaIdCard, FaBuilding, FaUserGraduate } from 'react-icons/fa'
import { useSession } from "next-auth/react"

interface Parent {
  _id: string
  firstName: string
  lastName: string
  email?: string
  phoneNumber: string
  alternativePhoneNumber?: string
  address?: string
  occupation?: string
  governmentId?: string
  relationshipToStudent: string
  studentIds: string[]
  createdAt: string
  emergencyContact?: string
}

export function ParentList() {
  const { data: session } = useSession()
  const [parents, setParents] = useState<Parent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchParents = async () => {
      try {
        if (session?.user?.schoolId) {
          const response = await fetch(`/api/parents?schoolId=${session.user.schoolId}`)
          if (!response.ok) throw new Error('Failed to fetch parents')
          const data = await response.json()
          setParents(data)
        }
      } catch (error) {
        console.error('Error fetching parents:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchParents()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (parents.length === 0) {
    return (
      <p className="text-gray-500 text-center">No parents found. Add your first parent to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {parents.map((parent) => (
        <Card 
          key={parent._id} 
          className="bg-gradient-to-br from-blue-100 to-indigo-100 border-[1px] border-gray-200 hover:border-blue-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-blue-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-3 rounded-xl shadow-sm">
                  <FaUserFriends className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {parent.firstName} {parent.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaUserGraduate className="h-4 w-4 text-blue-500" />
                    {parent.relationshipToStudent}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <FaPhone className="h-5 w-5 text-blue-500 mt-1" />
                  <div className="text-gray-900">
                    <div className="font-medium">Contact Information</div>
                    <div>{parent.phoneNumber}</div>
                    {parent.alternativePhoneNumber && (
                      <div className="mt-1">Alt: {parent.alternativePhoneNumber}</div>
                    )}
                    {parent.email && (
                      <div className="flex items-center gap-2 mt-1">
                        <FaEnvelope className="h-4 w-4 text-blue-500" />
                        {parent.email}
                      </div>
                    )}
                  </div>
                </div>

                {(parent.occupation || parent.address) && (
                  <div className="flex items-start gap-3 p-2">
                    <FaBuilding className="h-5 w-5 text-blue-500 mt-1" />
                    <div className="text-gray-900">
                      {parent.occupation && (
                        <div>
                          <span className="font-medium">Occupation:</span> {parent.occupation}
                        </div>
                      )}
                      {parent.address && (
                        <div className="mt-1">
                          <span className="font-medium">Address:</span> {parent.address}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardContent className="py-4 flex flex-col justify-center md:border-l border-blue-200/50">
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                  <span>Registered: {new Date(parent.createdAt).toLocaleDateString()}</span>
                </div>
                {parent.governmentId && (
                  <div className="flex items-center gap-2">
                    <FaIdCard className="h-4 w-4 text-blue-500" />
                    <span>ID: {parent.governmentId}</span>
                  </div>
                )}
                <div className="mt-2 text-gray-700">
                  <span className="font-medium">Students:</span> {parent.studentIds.length}
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
