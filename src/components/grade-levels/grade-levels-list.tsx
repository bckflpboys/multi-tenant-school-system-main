"use client"

import { useCallback, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { FaGraduationCap, FaUserGraduate, FaBook, FaUsers, FaMoneyBill, FaArrowRight } from 'react-icons/fa'

interface GradeLevel {
  _id: string
  name: string
  code: string
  description?: string
  capacity?: number
  headTeacherId?: string
  subjects: string[]
  fees?: number
  createdAt: string
  updatedAt: string
}

interface GradeLevelsListProps {
  schoolId: string
}

export function GradeLevelsList({ schoolId }: GradeLevelsListProps) {
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGradeLevels = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/grade-levels?schoolId=${schoolId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch grade levels')
      }
      const data = await response.json()
      setGradeLevels(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [schoolId])

  useEffect(() => {
    fetchGradeLevels()
  }, [fetchGradeLevels])

  if (isLoading) {
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

  if (gradeLevels.length === 0) {
    return (
      <p className="text-gray-500 text-center">No grade levels found. Add your first grade level to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {gradeLevels.map((gradeLevel) => (
        <Card 
          key={gradeLevel._id} 
          className="bg-gradient-to-br from-green-50 to-emerald-50 border-[1px] border-gray-200 hover:border-green-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-green-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-3 rounded-xl shadow-sm">
                  <FaGraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {gradeLevel.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                    <FaUserGraduate className="h-4 w-4 text-green-500" />
                    Code: {gradeLevel.code}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                {gradeLevel.description && (
                  <div className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                    <div className="text-gray-900">{gradeLevel.description}</div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-2">
                  <FaBook className="h-5 w-5 text-green-500" />
                  <div className="text-gray-900">
                    {gradeLevel.subjects.length} Subject{gradeLevel.subjects.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {gradeLevel.capacity && (
                  <div className="flex items-center gap-3 p-2">
                    <FaUsers className="h-5 w-5 text-green-500" />
                    <div className="text-gray-900">
                      Capacity: {gradeLevel.capacity} students
                    </div>
                  </div>
                )}

                {gradeLevel.fees !== undefined && (
                  <div className="flex items-center gap-3 p-2">
                    <FaMoneyBill className="h-5 w-5 text-green-500" />
                    <div className="text-gray-900">
                      Fees: ${gradeLevel.fees.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <div className="flex flex-col justify-center gap-4 p-6 md:border-l border-green-200/50">
              <div className="text-sm text-gray-600">
                Created: {format(new Date(gradeLevel.createdAt), 'MMM d, yyyy')}
              </div>
              <Button 
                variant="default"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-base font-medium px-8 py-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group flex items-center justify-center gap-2"
                onClick={() => {}}
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
