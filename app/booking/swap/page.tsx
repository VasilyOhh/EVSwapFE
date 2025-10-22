"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Zap, Clock } from "lucide-react"
import { BookingHeader } from "@/components/booking-header"

export default function SwapPage() {
  return (
    <>
      <BookingHeader title="Swap" />

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-2 gap-8 max-w-6xl">
          {/* Active Booking */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Booking</h3>
            <p className="text-sm text-gray-600 mb-6">Your current booking</p>

            <Card className="p-6 bg-white">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-[#A2F200] text-black text-xs font-medium rounded">
                  Confirmed
                </span>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Downtown Hub</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Today at 14:30</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 11h8V3H3v8zm10 0h8V3h-8v8zM3 21h8v-8H3v8zm10 0h8v-8h-8v8z" />
                    </svg>
                  </div>
                  <p className="text-sm font-mono text-gray-600">SW-2024-001</p>
                </div>
              </div>

              <Button className="w-full bg-black text-white hover:bg-gray-900 h-10">
                <Zap className="w-4 h-4 mr-2" />
                Check-in
              </Button>

              <button className="w-full mt-3 text-[#7241CE] hover:text-[#5a2fa0] font-medium text-sm">
                View Details
              </button>
            </Card>
          </div>

          {/* Subscription Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h3>
            <p className="text-sm text-gray-600 mb-6">Your current plan and usage</p>

            <Card className="p-6 bg-white">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Monthly Unlimited</h4>
                  <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded">Active</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Swaps Used</span>
                      <span className="text-sm font-semibold text-gray-900">12 / Unlimited</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#A2F200] h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Invoice:</span>
                      <span className="text-sm font-semibold text-gray-900">2024-02-15</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-black text-white hover:bg-gray-900 h-10">
                <Zap className="w-4 h-4 mr-2" />
                Manage Plan
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
