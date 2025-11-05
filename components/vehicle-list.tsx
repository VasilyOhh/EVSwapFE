"use client"

import { Card } from "@/components/ui/card"
import { Battery, AlertCircle } from "lucide-react"

interface Vehicle {
  id: number
  name: string
  model: string
  battery: string
  status: string
  lastSwap: string
}

interface VehicleListProps {
  vehicles: Vehicle[]
}

export function VehicleList({ vehicles }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-gray-900 mb-2">No vehicles added</h4>
        <p className="text-gray-600">Add your first vehicle using the form on the left</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Battery className="w-5 h-5 text-[#A2F200]" />
                <div>
                  <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                  <p className="text-sm text-gray-600">{vehicle.model}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium text-gray-700">Battery:</span> {vehicle.battery}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Last Swap:</span> {vehicle.lastSwap}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-[#A2F200] text-black text-xs font-medium rounded">
                {vehicle.status}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
