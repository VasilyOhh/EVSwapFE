"use client"

import type React from "react"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { StaffSidebar } from "@/components/staff-sidebar"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const isStaff = (user?.role ?? "").toString().toLowerCase() === "staff"
    if (!isLoading) {
      if (!isLoggedIn) {
        router.push("/signin")
      } else if (!isStaff) {
        router.push("/unauthorized")
      }
    }
  }, [isLoggedIn, isLoading, user, router])

  if (isLoading || !isLoggedIn || (user?.role ?? "").toString().toLowerCase() !== "staff") {
    return <div>Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <StaffSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  )
}
