"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { BookingHeader } from "@/components/booking-header"
import { AlertCircle, Battery } from "lucide-react"
import { VehicleForm } from "@/components/vehicle-form"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: "Tesla Model 3",
      model: "2024",
      battery: "82 kWh",
      status: "active",
      lastSwap: "2024-02-10",
    },
  ])

  const handleAddVehicle = (newVehicle: { name: string; model: string; battery: string }) => {
    const vehicle = {
      id: vehicles.length + 1,
      ...newVehicle,
      status: "active",
      lastSwap: new Date().toISOString().split("T")[0],
    }
    setVehicles([...vehicles, vehicle])
  }

  return (
    <>
      <BookingHeader title="Vehicles" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">My Vehicles</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div>
              <VehicleForm onAddVehicle={handleAddVehicle} />
            </div>

            {/* Right: List */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4">Added Vehicles</h4>
              {vehicles.length > 0 ? (
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
              ) : (
                <Card className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No vehicles added</h4>
                  <p className="text-gray-600 mb-6">Add your first vehicle to start using the battery swap service</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
