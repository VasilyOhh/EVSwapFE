"use client"

import { useState } from "react"
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
            <Card className="h-full bg-gradient-to-br from-[#E8F5E9] to-[#F1F8E9] border-0 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "url('/detailed-city-map.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(2px)",
                }}
              />

              <div className="absolute top-20 left-20 w-3 h-3 rounded-full bg-[#A2F200]"></div>
              <div className="absolute bottom-32 right-16 w-3 h-3 rounded-full bg-red-500"></div>
              <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-[#A2F200]"></div>

              <div className="text-center relative z-10">
                <div className="w-16 h-16 rounded-full border-4 border-[#7241CE] flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-[#7241CE]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nearby Stations</h3>
                <p className="text-sm text-gray-600 mb-6">Find and reserve battery swap stations</p>
                <Button className="bg-[#A2F200] text-black hover:bg-[#8fd600]">
                  <MapPin className="w-4 h-4 mr-2" />
                  Use My Location
                </Button>
              </div>
              <p className="absolute bottom-4 text-xs text-gray-500 relative z-10">
                Interactive map with real-time availability
              </p>
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
