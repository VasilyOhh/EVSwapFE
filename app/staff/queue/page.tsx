"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, DollarSign, Clock, Users, AlertTriangle, Wrench } from "lucide-react"
import { BookingHeader } from "@/components/booking-header"

export default function QueueManagementPage() {
  const bookings = [
    {
      id: 1,
      time: "15:30",
      name: "Alex Chen",
      vehicle: "Tesla Model 3",
      bookingId: "SA-2024-001",
      status: "pending",
      action: "Start Swap",
    },
    {
      id: 2,
      time: "16:00",
      name: "Sarah Kim",
      vehicle: "BMW iX3",
      bookingId: "SA-2024-002",
      status: "staff-in-progress",
      action: "staff-in-progress",
    },
    {
      id: 3,
      time: "16:30",
      name: "Mike Johnson",
      vehicle: "Nissan Leaf",
      bookingId: "SA-2024-003",
      status: "confirmed",
      action: "View",
    },
    {
      id: 4,
      time: "17:00",
      name: "Emily Davis",
      vehicle: "Tesla Model Y",
      bookingId: "SA-2024-004",
      status: "confirmed",
      action: "View",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">pending</Badge>
      case "staff-in-progress":
        return <Badge className="bg-blue-100 text-blue-800">staff-in-progress</Badge>
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">confirmed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <BookingHeader title="Queue Management" />

      {/* Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          <StatCard icon={<BarChart3 className="w-6 h-6" />} label="Today's Swaps" value="47" />
          <StatCard icon={<DollarSign className="w-6 h-6" />} label="Revenue" value="$1175" />
          <StatCard icon={<Clock className="w-6 h-6" />} label="Avg Time" value="2.8m" />
          <StatCard icon={<Users className="w-6 h-6" />} label="Rating" value="4.8" />
          <StatCard icon={<AlertTriangle className="w-6 h-6" />} label="Low Battery" value="3" />
          <StatCard icon={<Wrench className="w-6 h-6" />} label="maintenance" value="1" />
        </div>

        {/* Bookings Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Today's Bookings</h2>
            <p className="text-sm text-gray-600">Manage customer reservations and walk-ins</p>
          </div>

          <Card className="bg-white">
            <div className="divide-y divide-gray-200">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900">{booking.time}</div>
                      <div className="text-xs text-gray-600 mt-1">{booking.status}</div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{booking.name}</h3>
                      <p className="text-sm text-gray-600">{booking.vehicle}</p>
                      <p className="text-xs text-gray-500 mt-1">{booking.bookingId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(booking.status)}
                    {booking.status === "pending" ? (
                      <Button className="bg-[#7241CE] text-white hover:bg-[#5a2fa0] px-6">Start Swap</Button>
                    ) : (
                      <Button variant="outline" className="px-6 bg-transparent">
                        {booking.action}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="bg-white p-6 text-center">
      <div className="flex justify-center mb-3 text-[#7241CE]">{icon}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 mt-2">{label}</div>
    </Card>
  )
}
