"use client";

import { Card } from "@/components/ui/card";
import { BookingHeader } from "@/components/booking-header";
import { Clock, Zap } from "lucide-react";

type SwapHistoryItem = {
  id: number;
  station: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: "success" | "failed";
};

export default function HistoryPage() {
  const swapHistory: SwapHistoryItem[] = [
    {
      id: 1,
      station: "Downtown Hub",
      date: "2024-02-10",
      time: "14:30",
      duration: "5 min",
      price: 25,
      status: "success",
    },
    {
      id: 2,
      station: "Mall Station",
      date: "2024-02-08",
      time: "10:15",
      duration: "4 min",
      price: 25,
      status: "success",
    },
    {
      id: 3,
      station: "Airport Terminal",
      date: "2024-02-05",
      time: "16:45",
      duration: "6 min",
      price: 30,
      status: "failed",
    },
  ];

  return (
    <>
      <BookingHeader title="History" />
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Swap History</h3>
          <div className="space-y-4">
            {swapHistory.map((swap) => (
              <Card key={swap.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-3">{swap.station}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {swap.date} at {swap.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Zap className="w-4 h-4" />
                        <span>Duration: {swap.duration}</span>
                      </div>
                      <div className="mt-2">
                        {swap.status === "success" ? (
                          <span className="text-green-600 font-semibold">Payment Successful</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Payment Failed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">${swap.price}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
