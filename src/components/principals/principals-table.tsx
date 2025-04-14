"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, User, Mail, Phone, School, UserCircle } from "lucide-react"
import { toast } from "react-hot-toast"

interface Principal {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  gender?: string
  schoolName: string
  schoolId: string
}

export function PrincipalsTable() {
  const [principals, setPrincipals] = useState<Principal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrincipals = async () => {
      try {
        const response = await fetch('/api/principals')
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error || 'Error fetching principals')
        
        setPrincipals(data.principals)
      } catch (error) {
        console.error('Error:', error)
        setError(error instanceof Error ? error.message : 'Failed to load principals')
      } finally {
        setLoading(false)
      }
    }

    fetchPrincipals()
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

  if (principals.length === 0) {
    return (
      <p className="text-gray-500 text-center">No principals found. Add your first principal to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {principals.map((principal) => (
        <Card 
          key={principal._id} 
          className="bg-gradient-to-br from-purple-100 to-pink-100 border-[1px] border-gray-200 hover:border-purple-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-purple-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl shadow-sm">
                  <UserCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {`${principal.firstName} ${principal.lastName}`}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="h-4 w-4 text-purple-500" />
                    {principal.email}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <School className="h-5 w-5 text-purple-500" />
                  <div className="text-gray-900">{principal.schoolName}</div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <Phone className="h-5 w-5 text-purple-500" />
                  <div className="text-gray-900">{principal.phoneNumber || 'N/A'}</div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <User className="h-5 w-5 text-purple-500" />
                  <div className="text-gray-900 capitalize">{principal.gender || 'N/A'}</div>
                </div>
              </div>
            </CardContent>

            <div className="flex items-center justify-end gap-2 p-6">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-700 hover:text-gray-900 hover:bg-purple-200/50"
                onClick={() => {
                  toast.error('Edit functionality coming soon')
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-100"
                onClick={() => {
                  toast.error('Delete functionality coming soon')
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
