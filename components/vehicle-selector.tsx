"use client"

import { Card } from "@/components/ui/card"
import { Battery, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Vehicle {
  id: number
  name: string
  model: string
  battery: string
  status: string
  lastSwap: string
}

interface VehicleSelectorProps {
  vehicles: Vehicle[]
  selectedVehicleId: number | null
  onSelectVehicle: (id: number) => void
}

export function VehicleSelector({ vehicles, selectedVehicleId, onSelectVehicle }: VehicleSelectorProps) {
  if (vehicles.length === 0) {
    return (
      <Card className="p-8 text-center border-dashed">
        <Battery className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h4 className="font-semibold text-gray-900 mb-2">No vehicles available</h4>
        <p className="text-sm text-gray-600">Please add a vehicle first in the Vehicles page</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.id}
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-md",
            selectedVehicleId === vehicle.id ? "border-[#A2F200] border-2 bg-[#A2F200]/5" : "border-gray-200",
          )}
          onClick={() => onSelectVehicle(vehicle.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Battery
                className={cn("w-5 h-5 mt-0.5", selectedVehicleId === vehicle.id ? "text-[#A2F200]" : "text-gray-400")}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">{vehicle.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{vehicle.model}</p>
                <p className="text-xs text-gray-500">Battery: {vehicle.battery}</p>
              </div>
            </div>

            {selectedVehicleId === vehicle.id && (
              <div className="w-6 h-6 rounded-full bg-[#A2F200] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-black" />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
