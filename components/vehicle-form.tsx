"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

interface VehicleFormProps {
  onAddVehicle: (vehicle: {
    name: string
    model: string
    battery: string
  }) => void
}

export function VehicleForm({ onAddVehicle }: VehicleFormProps) {
  const [vin, setVin] = useState("")
  const [model, setModel] = useState("")
  const [battery, setBattery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (vin.trim() && model && battery) {
      onAddVehicle({
        name: vin,
        model,
        battery,
      })
      setVin("")
      setModel("")
      setBattery("")
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Add New Vehicle</CardTitle>
        <CardDescription>Enter your vehicle details</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vin">VIN</Label>
            <Input
              id="vin"
              placeholder="Vehicle Identification Number"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="border-muted-foreground/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Vehicle Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model" className="border-muted-foreground/20">
                <SelectValue placeholder="Select vehicle model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tesla-model3">Tesla Model 3</SelectItem>
                <SelectItem value="tesla-modely">Tesla Model Y</SelectItem>
                <SelectItem value="vinfast-vf8">VinFast VF8</SelectItem>
                <SelectItem value="vinfast-vf9">VinFast VF9</SelectItem>
                <SelectItem value="bmw-ix3">BMW iX3</SelectItem>
                <SelectItem value="nissan-leaf">Nissan Leaf</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="battery">Battery Type</Label>
            <Select value={battery} onValueChange={setBattery}>
              <SelectTrigger id="battery" className="border-muted-foreground/20">
                <SelectValue placeholder="Select battery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="60-kwh">Standard (60 kWh)</SelectItem>
                <SelectItem value="90-kwh">Extended (90 kWh)</SelectItem>
                <SelectItem value="120-kwh">Premium (120 kWh)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-[#A2F200] text-black hover:bg-[#8fd600] gap-2">
            <Plus className="w-4 h-4" />
            Add Vehicle
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
