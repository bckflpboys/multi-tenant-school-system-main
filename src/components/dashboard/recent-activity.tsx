"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    user: {
      name: "John Smith",
      image: "/avatars/01.png",
      email: "john.smith@school.com",
    },
    activity: "Added new assignment in Mathematics",
    timestamp: "2 hours ago",
  },
  {
    user: {
      name: "Sarah Johnson",
      image: "/avatars/02.png",
      email: "sarah.j@school.com",
    },
    activity: "Posted announcement for Class 10A",
    timestamp: "3 hours ago",
  },
  {
    user: {
      name: "Michael Brown",
      image: "/avatars/03.png",
      email: "m.brown@school.com",
    },
    activity: "Updated class schedule",
    timestamp: "5 hours ago",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div 
          className="flex items-center p-2 -mx-2 rounded-lg transition-colors hover:bg-gray-50" 
          key={index}
        >
          <Avatar className="h-9 w-9 border-2 border-white ring-2 ring-gray-100">
            <AvatarImage src={activity.user.image} alt="Avatar" />
            <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 font-medium">
              {activity.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{activity.user.name}</p>
              <time className="text-xs text-gray-500">{activity.timestamp}</time>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1">{activity.activity}</p>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <button className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors">
          Load more activities
        </button>
      </div>
    </div>
  )
}
