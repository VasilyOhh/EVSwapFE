"use client";

import { useState, useEffect, useMemo } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Star, Filter, Zap, Loader2 } from "lucide-react";
import { BookingHeader } from "@/components/booking-header";
import { useRouter } from "next/navigation";

interface Station {
  id: string;
  name: string;
  address: string;
  available: number;
  total: number;
  time: string;
  distance: string;
  price: number;
  rating: number;
  status: "open" | "maintenance" | "closed";
}

/* ---------- Helpers ---------- */
const useApiBase = () =>
  useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080",
    []
  );

// Fetcher with authentication token
const fetcher = async (url: string): Promise<Station[]> => {
  const token = localStorage.getItem("token");
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`API Error: ${res.status} - ${res.statusText}`);
  const data = await res.json();
  return (Array.isArray(data) ? data : data.content ?? []).map((item: any) => ({
    id: item.stationID?.toString() || Math.random().toString(),
    name: item.stationName || "Unknown Station",
    address: item.address || "No address",
    available: item.availableSlots ?? item.available ?? 5,
    total: item.totalSlots ?? item.total ?? 10,
    time: item.operatingHours || "24/7",
    distance: `${(item.distanceKm ?? 0).toFixed(1)} km`,
    price: Number(item.pricePerSwap ?? item.price ?? 50000),
    rating: Number(item.rating ?? 4.5),
    status: (
      (item.status ?? "open").toString().toLowerCase() as
        | "open"
        | "maintenance"
        | "closed"
    ),
  }));
};

export default function FindStationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [MapComponent, setMapComponent] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [radiusKm, setRadiusKm] = useState(5);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [reservingId, setReservingId] = useState<string | null>(null);
  const API_BASE = useApiBase();
  const router = useRouter();

  /* ---------- Get Location ---------- */
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setIsLoadingLocation(false);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setLocationError(
            "Could not get your location. Using default location (HCM City)."
          );
          setUserLocation({ lat: 10.75819, lng: 106.65405 });
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser");
      setUserLocation({ lat: 10.75819, lng: 106.65405 });
      setIsLoadingLocation(false);
    }
  }, []);

  /* ---------- Load Map ---------- */
  useEffect(() => {
    const loadMap = async () => {
      try {
        const module = await import("@/components/NearbyStationsMap");
        setMapComponent(() => module.default);
      } catch (err) {
        console.error("Failed to load map:", err);
      }
    };
    loadMap();
  }, []);

  /* ---------- Fetch stations ---------- */
  const apiUrl = userLocation
    ? `${API_BASE}/api/stations/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}&radiusKm=${radiusKm}`
    : null;

  const {
    data: stations = [],
    isLoading,
    error,
    mutate,
  } = useSWR<Station[]>(apiUrl, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    onError: (err) => console.error("SWR Error:", err),
  });

  /* ---------- Click outside filter ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (showFilterMenu && !t.closest("[data-filter-button]"))
        setShowFilterMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFilterMenu]);

  /* ---------- Filter ---------- */
  const filteredStations = stations
    .filter((s) => s.name && s.address)
    .filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  /* ---------- Refresh Location ---------- */
  const refreshLocation = () => {
    if (!("geolocation" in navigator)) return;
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationError(null);
        setIsLoadingLocation(false);
        mutate();
      },
      (err) => {
        setLocationError(err.message);
        setIsLoadingLocation(false);
      }
    );
  };

  /* ---------- Reserve (Booking + VNPAY) ---------- */
  const handleReserve = async (station: Station) => {
    try {
      setReservingId(station.id);
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please sign in to reserve a station.");
        router.push("/signin");
        setReservingId(null);
        return;
      }

      // 1️⃣ Tạo booking draft
      const draft = {
        stationId: station.id,
        expectedTime: new Date().toISOString(),
        swapType: "FULL",
      };

      const bookingRes = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });

      if (!bookingRes.ok)
        throw new Error(await bookingRes.text());
      const booking = await bookingRes.json();
      localStorage.setItem("pendingBooking", JSON.stringify(booking));

      // 2️⃣ Gọi API VNPAY tạo link thanh toán
      const paymentRes = await fetch(`http://localhost:8080/api/bookings/3/momo-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: booking.id,
          amount: booking.totalPrice,
          orderDescription: `Thanh toán đổi pin tại trạm ${station.name}`,
          orderType: "EVSWAP",
          language: "vn",
          bankCode: "NCB",
          returnUrl: `${window.location.origin}/payment/result`,
        }),
      });

      if (!paymentRes.ok)
        throw new Error(await paymentRes.text());
      const paymentData = await paymentRes.json();

      if (!paymentData?.paymentUrl)
        throw new Error("Không nhận được link thanh toán từ VNPAY.");

      // 3️⃣ Mở link VNPAY
      window.location.href = paymentData.paymentUrl;
    } catch (err: any) {
      console.error("Booking failed:", err.message);
      alert("Đặt lịch thất bại: " + err.message);
      setReservingId(null);
    }
  };

  return (
    <>
      <BookingHeader title="Find Stations" />
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-4 gap-6 p-8 h-full">
          {/* Map */}
          <div className="col-span-2 row-span-2">
            <Card className="h-full border-0 shadow-lg overflow-hidden">
              {MapComponent ? (
                <MapComponent />
              ) : (
                <div className="p-4 text-gray-500">Loading map...</div>
              )}
            </Card>
          </div>

          {/* List */}
          <div className="col-span-2 flex flex-col">
            {/* Location status */}
            {locationError && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm flex items-center justify-between">
                <span>⚠️ {locationError}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshLocation}
                  className="ml-2 h-7"
                >
                  Retry
                </Button>
              </div>
            )}
            {isLoadingLocation && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Getting your
                location...
              </div>
            )}
            {userLocation && !isLoadingLocation && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    Location: {userLocation.lat.toFixed(4)},{" "}
                    {userLocation.lng.toFixed(4)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={refreshLocation}
                  className="h-6 px-2"
                >
                  Refresh
                </Button>
              </div>
            )}

            {/* Filter + Search */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3 relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent relative"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  data-filter-button
                >
                  <Filter className="w-4 h-4" />
                  Filter: {radiusKm}km
                </Button>
                {showFilterMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[180px]">
                    <div className="text-xs font-semibold text-gray-700 mb-2 px-2">
                      Distance Radius
                    </div>
                    {[2, 5, 10, 20].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => {
                          setRadiusKm(radius);
                          setShowFilterMenu(false);
                          mutate();
                        }}
                        className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-gray-100 transition-colors ${
                          radiusKm === radius
                            ? "bg-[#A2F200] text-black font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        Within {radius}km
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Input
                placeholder="Search stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Station List */}
            <div className="flex-1 overflow-auto space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">
                {isLoading
                  ? "Loading stations..."
                  : `Available Stations (${filteredStations.length})`}
              </h3>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  <strong>Failed to load stations</strong>
                  <p className="mt-1 text-xs">{(error as any).message}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => mutate()}
                    className="mt-2"
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {!isLoading &&
                filteredStations.map((station) => (
                  <Card
                    key={station.id}
                    className="p-4 hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {station.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {station.address}
                        </p>
                      </div>
                      {station.status === "open" && (
                        <span className="px-2 py-1 bg-[#A2F200] text-black text-xs rounded font-medium">
                          open
                        </span>
                      )}
                      {station.status === "maintenance" && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs rounded font-medium">
                          maintenance
                        </span>
                      )}
                      {station.status === "closed" && (
                        <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded font-medium">
                          closed
                        </span>
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
                      <span className="font-semibold text-gray-900">
                        {Number(station.price).toLocaleString()}₫/swap
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">
                          {station.rating}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        className="bg-[#A2F200] text-black hover:bg-[#8fd600] h-7 px-4 text-xs"
                        onClick={() => handleReserve(station)}
                        disabled={reservingId === station.id}
                      >
                        {reservingId === station.id ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Reserving...
                          </>
                        ) : (
                          "Reserve"
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
