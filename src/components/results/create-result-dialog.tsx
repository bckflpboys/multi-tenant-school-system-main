"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function CreateResultDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const [formData, setFormData] = useState({
    studentName: "",
    subject: "",
    examType: "",
    score: "",
    totalMarks: "",
    term: "",
    academicYear: "",
    remarks: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.schoolId) {
      toast.error("No school ID found")
      return
    }

    try {
      setIsLoading(true)

      const score = parseInt(formData.score)
      const totalMarks = parseInt(formData.totalMarks)
      const percentage = (score / totalMarks) * 100

      const response = await fetch('/api/results', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          score,
          totalMarks,
          percentage,
          schoolId: session.user.schoolId,
          teacherName: session.user.name
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create result')
      }

      toast.success("Result created successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating result:', error)
      toast.error("Failed to create result")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Result
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Result</DialogTitle>
          <DialogDescription>
            Add a new examination result for a student.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="examType">Exam Type</Label>
              <Select
                value={formData.examType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, examType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Quiz">Quiz</SelectItem>
                  <SelectItem value="Test">Test</SelectItem>
                  <SelectItem value="Midterm">Midterm</SelectItem>
                  <SelectItem value="Final">Final</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Select
                value={formData.term}
                onValueChange={(value) => setFormData(prev => ({ ...prev, term: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First">First Term</SelectItem>
                  <SelectItem value="Second">Second Term</SelectItem>
                  <SelectItem value="Third">Third Term</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score</Label>
              <Input
                id="score"
                type="number"
                value={formData.score}
                onChange={(e) => setFormData(prev => ({ ...prev, score: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                value={formData.totalMarks}
                onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="academicYear">Academic Year</Label>
            <Input
              id="academicYear"
              value={formData.academicYear}
              onChange={(e) => setFormData(prev => ({ ...prev, academicYear: e.target.value }))}
              required
              placeholder="e.g., 2024-2025"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
              placeholder="Optional remarks about the student's performance"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Result"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
