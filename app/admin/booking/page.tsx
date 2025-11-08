"use client"

import { useEffect, useState } from "react"

interface Booking {
  id: number
  driverName: string
  customerName: string
  date: string
  status: string
}

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Giả lập gọi API
    setTimeout(() => {
      setBookings([
        { id: 1, driverName: "Nguyễn Văn A", customerName: "Trần Thị B", date: "2025-11-05", status: "Completed" },
        { id: 2, driverName: "Phạm Văn C", customerName: "Lê Văn D", date: "2025-11-06", status: "Pending" },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div className="p-6">Đang tải danh sách booking...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Danh sách Booking</h1>

      <table className="w-full border-collapse border border-gray-300 bg-white shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tài xế</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Khách hàng</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Ngày</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition">
              <td className="border border-gray-300 px-4 py-2">{booking.id}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.driverName}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.customerName}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.date}</td>
              <td className="border border-gray-300 px-4 py-2">{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
