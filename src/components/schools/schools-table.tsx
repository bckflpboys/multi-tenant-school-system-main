"use client"

import { useState } from "react"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Building2, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { schoolApiSchema } from "@/lib/validations/school"

export type School = z.infer<typeof schoolApiSchema> & {
  id: string
  createdAt: string
  updatedAt: string
  status: 'active' | 'inactive'
}

const getStatusColor = (status: School['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

interface SchoolsTableProps {
  data: School[]
}

export function SchoolsTable({ data }: SchoolsTableProps) {
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

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

  if (data.length === 0) {
    return (
      <p className="text-gray-500 text-center">No schools found. Add your first school to get started.</p>
    )
  }

  return (
    <div className="space-y-6">
      {data.map((school) => (
        <Card 
          key={school.id} 
          className="bg-gradient-to-br from-purple-100 to-pink-100 border-[1px] border-gray-200 hover:border-purple-500/30 transition-all duration-200 overflow-hidden"
        >
          <div className="grid md:grid-cols-[1fr_1.5fr_200px] gap-4">
            <CardHeader className="pb-4 md:border-r border-purple-200/50">
              <div className="flex items-center gap-4">
                <div className="bg-white bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl shadow-sm">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {school.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <Mail className="h-4 w-4 text-purple-500" />
                    {school.email}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg">
                  <Phone className="h-5 w-5 text-purple-500" />
                  <div className="text-gray-900">{school.phone}</div>
                </div>

                <div className="flex items-center gap-3 p-2">
                  <Badge className={getStatusColor(school.status)}>
                    {school.status}
                  </Badge>
                </div>
              </div>
            </CardContent>

            <div className="flex items-center justify-end gap-2 p-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700 hover:text-gray-900 hover:bg-purple-200/50">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(school.id)}>
                    Copy school ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.error('View details coming soon')}>
                    View details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.error('Edit functionality coming soon')}>
                    Edit
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
