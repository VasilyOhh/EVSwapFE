"use client"

import { Card } from "@/components/ui/card"
import { Check, Zap, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServicePackage {
  id: string
  name: string
  price: number
  type: "per-swap" | "per-month"
}

interface MonthlySubscription {
  isActive: boolean
  usageCount: number
  expiryDate: string
}

interface ServicePackageSelectorProps {
  selectedPackageId: string | null
  onSelectPackage: (id: string) => void
  monthlySubscription?: MonthlySubscription
}

const packages: ServicePackage[] = [
  {
    id: "per-swap",
    name: "Per Swap",
    price: 650000,
    type: "per-swap",
  },
  {
    id: "per-month",
    name: "Per Month",
    price: 3500000,
    type: "per-month",
  },
]

export function ServicePackageSelector({
  selectedPackageId,
  onSelectPackage,
  monthlySubscription,
}: ServicePackageSelectorProps) {
  return (
    <div className="space-y-4">
      {packages.map((pkg) => (
        <Card
          key={pkg.id}
          className={cn(
            "p-6 cursor-pointer transition-all hover:shadow-md",
            selectedPackageId === pkg.id ? "border-[#A2F200] border-2 bg-[#A2F200]/5" : "border-gray-200",
          )}
          onClick={() => onSelectPackage(pkg.id)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-lg mb-1">{pkg.name}</h4>
              <p className="text-2xl font-bold text-gray-900">{pkg.price.toLocaleString("vi-VN")} VNĐ</p>
            </div>

            {selectedPackageId === pkg.id && (
              <div className="w-6 h-6 rounded-full bg-[#A2F200] flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-black" />
              </div>
            )}
          </div>

          {/* Show subscription info if user has active monthly plan */}
          {pkg.type === "per-month" && monthlySubscription?.isActive && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-[#A2F200]" />
                <span className="text-gray-700">
                  <span className="font-semibold">{monthlySubscription.usageCount}</span> swaps used this month
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">
                  Expires: <span className="font-semibold">{monthlySubscription.expiryDate}</span>
                </span>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
