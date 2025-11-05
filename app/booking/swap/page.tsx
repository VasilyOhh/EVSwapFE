"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookingHeader } from "@/components/booking-header"
import { VehicleSelector } from "@/components/vehicle-selector"
import { ServicePackageSelector } from "@/components/service-package-selector"
import { MapPin, Clock } from "lucide-react"

interface Vehicle {
  id: number
  name: string
  model: string
  battery: string
  status: string
  lastSwap: string
}

interface Station {
  id: string
  name: string
  address: string
  time: string
  distance: string
}

export default function SwapPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null)
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)

  // Mock vehicles data - replace with actual data from API/localStorage
  const [vehicles] = useState<Vehicle[]>([
    {
      id: 1,
      name: "VIN12345",
      model: "Tesla Model 3",
      battery: "75 kWh",
      status: "Active",
      lastSwap: "2024-01-15",
    },
    {
      id: 2,
      name: "VIN67890",
      model: "VinFast VF8",
      battery: "87.7 kWh",
      status: "Active",
      lastSwap: "2024-01-10",
    },
  ])

  // Mock monthly subscription data - replace with actual data from API
  const monthlySubscription = {
    isActive: true,
    usageCount: 8,
    expiryDate: "2024-02-15",
  }

  // Load selected station from localStorage
  useEffect(() => {
    const stationData = localStorage.getItem("selectedStation")
    if (stationData) {
      setSelectedStation(JSON.parse(stationData))
    }
  }, [])

  const handleBooking = () => {
    if (!selectedVehicleId || !selectedPackageId) {
      alert("Please select a vehicle and service package")
      return
    }

    // Handle booking logic here
    console.log("Booking:", {
      vehicleId: selectedVehicleId,
      packageId: selectedPackageId,
      station: selectedStation,
    })

    alert("Booking confirmed!")
  }

  return (
    <>
      <BookingHeader title="Battery Swap Booking" />

      <div className="flex-1 overflow-auto p-8">
        {/* Station Info Banner */}
        {selectedStation && (
          <div className="mb-6 p-4 bg-[#A2F200]/10 border border-[#A2F200]/30 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Selected Station</h3>
            <div className="flex items-start gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">{selectedStation.name}</p>
                  <p className="text-gray-600">{selectedStation.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">{selectedStation.time}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 max-w-7xl">
          {/* Left: Vehicle Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Vehicle</h3>
            <p className="text-sm text-gray-600 mb-6">Choose which vehicle to swap battery for</p>

            <VehicleSelector
              vehicles={vehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
            />
          </div>

          {/* Right: Service Package Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Service Package</h3>
            <p className="text-sm text-gray-600 mb-6">Choose your preferred payment option</p>

            <ServicePackageSelector
              selectedPackageId={selectedPackageId}
              onSelectPackage={setSelectedPackageId}
              monthlySubscription={monthlySubscription}
            />

            {/* Booking Button */}
            <Button
              className="w-full mt-6 bg-black text-white hover:bg-gray-900 h-12 text-base font-semibold"
              onClick={handleBooking}
              disabled={!selectedVehicleId || !selectedPackageId}
            >
              Booking
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
