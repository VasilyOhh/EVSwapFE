"use client"

import { Card } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">View performance and analytics reports</p>
      </div>

      <div className="p-8">
        <Card className="bg-white p-12 text-center">
          <p className="text-gray-600">Reports feature coming soon</p>
        </Card>
      </div>
    </div>
  )
}
