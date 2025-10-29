"use client"

import { useState, useEffect } from "react" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, Star, Filter, Zap } from "lucide-react"
import { BookingHeader } from "@/components/booking-header"

interface Station {
  id: string
  name: string
  address: string
  available: number
  total: number
  time: string
  distance: string
  price: number
  rating: number
  status: "open" | "maintenance" | "closed"
}

const mockStations: Station[] = [
  {
    id: "1",
    name: "Downtown Hub",
    address: "123 Main St, City Center",
    available: 12,
    total: 20,
    time: "< 5 min",
    distance: "0.8 km",
    price: 25,
    rating: 4.8,
    status: "open",
  },
  {
    id: "2",
    name: "Mall Station",
    address: "456 Shopping Ave",
    available: 8,
    total: 15,
    time: "10-15 min",
    distance: "1.2 km",
    price: 25,
    rating: 4.6,
    status: "open",
  },
  {
    id: "3",
    name: "Airport Terminal",
    address: "789 Airport Rd",
    available: 0,
    total: 25,
    time: "Closed",
    distance: "5.4 km",
    price: 30,
    rating: 4.9,
    status: "maintenance",
  },
]

export default function FindStationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [MapComponent, setMapComponent] = useState<any>(null)

  // Load map component chỉ ở client
  useEffect(() => {
    const loadMap = async () => {
      const module = await import("@/components/NearbyStationsMap")
      setMapComponent(() => module.default)
    }
    loadMap()
  }, [])

  const filteredStations = mockStations.filter(
    (station) =>
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <BookingHeader title="Find Stations" />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-4 gap-6 p-8 h-full">
          {/* Map Section */}
          <div className="col-span-2 row-span-2">
            <Card className="h-full border-0 shadow-lg overflow-hidden">
              {MapComponent ? <MapComponent /> : <div className="p-4">Loading map...</div>}
            </Card>
          </div>

          {/* Stations List */}
          <div className="col-span-2 flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex-1 overflow-auto space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Available Stations</h3>
              {filteredStations.map((station) => (
                <Card key={station.id} className="p-4 hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{station.name}</h4>
                      <p className="text-xs text-gray-500">{station.address}</p>
                    </div>
                    {station.status === "open" && (
                      <span className="px-2 py-1 bg-[#A2F200] text-black text-xs rounded font-medium">open</span>
                    )}
                    {station.status === "maintenance" && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded font-medium">maintenance</span>
                    )}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <Zap className="w-3 h-3 text-[#A2F200]" />
                      <span className="text-gray-700">
                        {station.available}/{station.total} available
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{station.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{station.distance}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 flex-1">
                    <span className="font-semibold text-gray-900">${station.price}/swap</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{station.rating}</span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-[#A2F200] text-black hover:bg-[#8fd600] h-7 px-4 text-xs">Reserve</Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
