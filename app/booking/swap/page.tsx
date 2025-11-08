"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Clock, MapPin, BadgeCheck } from "lucide-react";
import { BookingHeader } from "@/components/booking-header";

type Booking = {
  id: number;
  orderId: string;
  stationId: number;
  stationName?: string;
  packageId?: number;
  packageName?: string;
  startAt: string;           // ISO
  durationHours: number;
  amount: number;            // VND
  paymentProvider: string;   // VNPAY / MoMo ...
  gatewayTransactionNo?: string;
  status?: "CONFIRMED" | "CHECKED_IN" | "CANCELLED";
};

const useApiBase = () =>
  useMemo(() => process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080", []);

function formatDateTime(iso?: string) {
  if (!iso) return "--";
  const d = new Date(iso);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export default function SwapPage() {
  const API_BASE = useApiBase();
  const router = useRouter();
  const sp = useSearchParams();
  const bookingIdFromQuery = sp.get("bookingId");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load booking từ localStorage hoặc fetch theo ?bookingId
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const raw = localStorage.getItem("booking");
        if (raw) {
          const b: Booking = JSON.parse(raw);
          if (bookingIdFromQuery && Number(bookingIdFromQuery) !== b.id) {
            const res = await fetch(`${API_BASE}/api/bookings/${bookingIdFromQuery}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
              },
            });
            if (res.ok) {
              const fetched = await res.json();
              setBooking(fetched);
            } else {
              setBooking(b);
            }
          } else {
            setBooking(b);
          }
        } else if (bookingIdFromQuery) {
          const res = await fetch(`${API_BASE}/api/bookings/${bookingIdFromQuery}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          });
          if (!res.ok) throw new Error("Không tìm thấy booking.");
          const fetched = await res.json();
          setBooking(fetched);
          localStorage.setItem("booking", JSON.stringify(fetched));
        } else {
          setError("Không có dữ liệu booking.");
        }
      } catch (e: any) {
        setError(e?.message || "Không tải được booking.");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingIdFromQuery]);

  // Check-in (Swagger: POST /api/bookings/{id}/arrive)
  const handleCheckIn = async () => {
    if (!booking) return;
    try {
      setCheckingIn(true);
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API_BASE}/api/bookings/${booking.id}/arrive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(await res.text());

      let updated: Booking | null = null;
      try {
        updated = (await res.json()) as Booking;
      } catch {
        updated = { ...booking, status: "CHECKED_IN" };
      }

      setBooking(updated);
      localStorage.setItem("booking", JSON.stringify(updated));
    } catch (e: any) {
      alert(e?.message || "Check-in thất bại.");
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <>
      <BookingHeader title="Swap" />
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-2 gap-8 max-w-6xl">
          {/* Active Booking */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Booking</h3>
            <p className="text-sm text-gray-600 mb-6">Your current booking</p>
            <Card className="p-6 bg-white">
              {loading ? (
                <div className="py-12 text-center text-gray-500">Đang tải booking…</div>
              ) : error || !booking ? (
                <div className="py-8">
                  <p className="text-sm text-red-600 mb-4">{error ?? "Chưa có booking."}</p>
                  <Button
                    onClick={() => router.push("/booking/find-stations")}
                    className="bg-[#A2F200] text-black hover:bg-[#8fd600]"
                  >
                    Tạo booking mới
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded ${
                        booking.status === "CHECKED_IN"
                          ? "bg-green-100 text-green-700"
                          : "bg-[#A2F200] text-black"
                      }`}
                    >
                      <BadgeCheck className="w-4 h-4" />
                      {booking.status ?? "CONFIRMED"}
                    </span>
                  </div>

                  <div className="mb-6 space-y-1">
                    <h4 className="font-semibold text-gray-900">
                      {booking.stationName ?? `Station #${booking.stationId}`}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatDateTime(booking.startAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Booking ID: {booking.id} • Order: {booking.orderId}</span>
                    </div>
                    <div className="text-sm text-gray-700">
                      Gói: {booking.packageName ?? booking.packageId ?? "Swap"} • Thời lượng:{" "}
                      {booking.durationHours}h • Thanh toán:{" "}
                      {Number(booking.amount).toLocaleString()}₫ ({booking.paymentProvider})
                    </div>
                  </div>

                  {/* QR placeholder – thay bằng ảnh QR từ BE nếu muốn */}
                  <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center mb-6">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 11h8V3H3v8zm10 0h8V3h-8v8zM3 21h8v-8H3v8zm10 0h8v-8h-8v8z" />
                        </svg>
                      </div>
                      <p className="text-sm font-mono text-gray-600">SW-{booking.id}</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-black text-white hover:bg-gray-900 h-10"
                    onClick={handleCheckIn}
                    disabled={checkingIn || booking.status === "CHECKED_IN"}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {checkingIn
                      ? "Checking in..."
                      : booking.status === "CHECKED_IN"
                      ? "Already checked-in"
                      : "Check-in"}
                  </Button>

                  <button
                    className="w-full mt-3 text-[#7241CE] hover:text-[#5a2fa0] font-medium text-sm"
                    onClick={() => router.push(`/booking/detail/${booking.id}`)}
                  >
                    View Details
                  </button>
                </>
              )}
            </Card>
          </div>

          {/* Subscription Status (demo) */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Status</h3>
            <p className="text-sm text-gray-600 mb-6">Your current plan and usage</p>
            <Card className="p-6 bg-white">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Monthly Unlimited</h4>
                  <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded">Active</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Swaps Used</span>
                      <span className="text-sm font-semibold text-gray-900">12 / Unlimited</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#A2F200] h-2 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Invoice:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {new Date().toISOString().slice(0, 10)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-900 h-10">
                <Zap className="w-4 h-4 mr-2" />
                Manage Plan
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
