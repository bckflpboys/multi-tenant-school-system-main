"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { SettingsForm } from "@/components/settings/settings-form"
import type { SettingsFormValues } from "@/lib/validations/settings"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: SettingsFormValues) => {
    if (!session?.user?.schoolId) {
      console.error('No school ID found');
      return;
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          schoolId: session.user.schoolId
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update settings')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">School Settings</h2>
        <p className="text-muted-foreground">
          Manage your school&apos;s settings and configurations.
        </p>
      </div>

      <Card className="p-6">
        <SettingsForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          schoolId={session?.user?.schoolId}
        />
      </Card>
    </div>
  )
}
