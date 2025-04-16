"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Class {
  _id: string
  name: string
  grade: string
  createdAt: string
  teacher: string
}

export function ClassList() {
  const { data: session } = useSession()
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (session?.user?.schoolId) {
          const response = await fetch(`/api/classes?schoolId=${session.user.schoolId}`)
          if (!response.ok) throw new Error('Failed to fetch classes')
          const data = await response.json()
          setClasses(data)
        }
      } catch (error) {
        console.error('Error fetching classes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClasses()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (classes.length === 0) {
    return (
      <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-white p-8 text-center shadow-md">
        <h2 className="text-lg font-semibold text-gray-900">No classes found</h2>
        <p className="mt-2 text-gray-600">
          Create your first class to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-blue-50/50">
              <TableHead className="text-gray-900 font-semibold">Name</TableHead>
              <TableHead className="text-gray-900 font-semibold">Grade</TableHead>
              <TableHead className="text-gray-900 font-semibold">Teacher</TableHead>
              <TableHead className="text-gray-900 font-semibold">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow 
                key={classItem._id}
                className="hover:bg-blue-50/50 transition-colors duration-200"
              >
                <TableCell className="font-medium text-gray-900">{classItem.name}</TableCell>
                <TableCell className="text-gray-700">{classItem.grade}</TableCell>
                <TableCell className="text-gray-700">{classItem.teacher || 'Not Assigned'}</TableCell>
                <TableCell className="text-gray-700">
                  {new Date(classItem.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}