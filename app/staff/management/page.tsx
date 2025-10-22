"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Eye, Edit2, Trash2, Plus } from "lucide-react"
import { useState } from "react"

type StaffRole = "manager" | "technician" | "support"

interface StaffMember {
  id: number
  name: string
  email: string
  role: StaffRole
  status: "active" | "inactive"
  joinDate: string
  permissions: string[]
}

export default function StaffManagementPage() {
  const [selectedRole, setSelectedRole] = useState<StaffRole | "all">("all")

  const staffMembers: StaffMember[] = [
    {
      id: 1,
      name: "John Manager",
      email: "john@evswap.com",
      role: "manager",
      status: "active",
      joinDate: "2024-01-15",
      permissions: [
        "View all bookings",
        "Manage staff",
        "View reports",
        "Edit settings",
        "Approve transactions",
        "Access analytics",
      ],
    },
    {
      id: 2,
      name: "Sarah Technician",
      email: "sarah@evswap.com",
      role: "technician",
      status: "active",
      joinDate: "2024-02-20",
      permissions: ["View assigned bookings", "Update swap status", "Report issues", "View own performance"],
    },
    {
      id: 3,
      name: "Mike Support",
      email: "mike@evswap.com",
      role: "support",
      status: "active",
      joinDate: "2024-03-10",
      permissions: ["View customer info", "Handle inquiries", "Create support tickets", "View FAQ"],
    },
    {
      id: 4,
      name: "Lisa Technician",
      email: "lisa@evswap.com",
      role: "technician",
      status: "inactive",
      joinDate: "2024-01-05",
      permissions: ["View assigned bookings", "Update swap status", "Report issues", "View own performance"],
    },
  ]

  const roleDescriptions: Record<StaffRole, { title: string; description: string; color: string }> = {
    manager: {
      title: "Manager",
      description: "Full access to all features and staff management",
      color: "bg-purple-100 text-purple-800",
    },
    technician: {
      title: "Technician",
      description: "Can perform swaps and update booking status",
      color: "bg-blue-100 text-blue-800",
    },
    support: {
      title: "Support",
      description: "Can view customer info and handle inquiries",
      color: "bg-green-100 text-green-800",
    },
  }

  const filteredStaff =
    selectedRole === "all" ? staffMembers : staffMembers.filter((member) => member.role === selectedRole)

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage team members and their permissions</p>
          </div>
          <Button className="bg-[#7241CE] hover:bg-[#5a2fa0] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Role Filter */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Filter by Role</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedRole("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRole === "all" ? "bg-[#7241CE] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Staff
            </button>
            {(Object.keys(roleDescriptions) as StaffRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRole === role ? "bg-[#7241CE] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {roleDescriptions[role].title}
              </button>
            ))}
          </div>
        </div>

        {/* Role Permissions Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(Object.keys(roleDescriptions) as StaffRole[]).map((role) => (
            <Card key={role} className="bg-white p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-2 rounded-lg ${roleDescriptions[role].color}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{roleDescriptions[role].title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{roleDescriptions[role].description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {staffMembers
                  .filter((m) => m.role === role)
                  .slice(0, 2)
                  .map((member) => (
                    <div key={member.id} className="text-xs text-gray-600">
                      • {member.name}
                    </div>
                  ))}
                {staffMembers.filter((m) => m.role === role).length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{staffMembers.filter((m) => m.role === role).length - 2} more
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Staff List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Members</h2>
          <div className="space-y-4">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <Badge className={roleDescriptions[member.role].color}>
                        {roleDescriptions[member.role].title}
                      </Badge>
                      <Badge
                        className={
                          member.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {member.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{member.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Joined: {member.joinDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-3">Permissions:</p>
                  <div className="flex flex-wrap gap-2">
                    {member.permissions.map((permission, idx) => (
                      <Badge key={idx} className="bg-blue-50 text-blue-700 border border-blue-200">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
