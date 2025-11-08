"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingHeader } from "@/components/booking-header";

type BookingStatus = "pending" | "staff-in-progress" | "confirmed" | "completed" | "cancelled";

interface QueueItem {
  id: string;
  customer: string;
  vehicle: string;
  startedAt: string;
  status: BookingStatus;
}

interface Directive {
  ticketId: string;
  action: "approve" | "reject" | "follow-up";
  notes?: string;
}

export default function QueuePage() {
  const [items, setItems] = useState<QueueItem[]>([
    { id: "BK-001", customer: "Le Minh", vehicle: "Yadea E8", startedAt: "10:05", status: "staff-in-progress" },
    { id: "BK-002", customer: "Tran Ha", vehicle: "VinFast Evo", startedAt: "10:20", status: "pending" },
  ]);
  const [directives, setDirectives] = useState<Directive[]>([]);

  useEffect(() => {
    const es = new EventSource("/api/directives");
    es.onmessage = (e) => {
      const d = JSON.parse(e.data) as Directive;
      setDirectives((prev) => [d, ...prev].slice(0, 5));
    };
    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  return (
    <div className="flex-1 overflow-auto">
      <BookingHeader title="Queue" />
      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((it) => (
            <Card key={it.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.id} • {it.customer}</div>
                  <div className="text-xs text-gray-600">{it.vehicle} • Start {it.startedAt}</div>
                </div>
                <Badge className={
                  it.status === "staff-in-progress" ? "bg-amber-100 text-amber-800"
                  : it.status === "confirmed" ? "bg-blue-100 text-blue-800"
                  : it.status === "completed" ? "bg-green-100 text-green-800"
                  : it.status === "cancelled" ? "bg-gray-100 text-gray-800"
                  : "bg-purple-100 text-purple-800"
                }>
                  {it.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Admin directives (real-time) */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Admin Directives</h3>
          {directives.length === 0 && <Card className="p-4 text-sm text-gray-500">No directives yet.</Card>}
          {directives.map((d, idx) => (
            <Card key={idx} className="p-4">
              <div className="text-sm">Ticket: <span className="font-mono">{d.ticketId}</span></div>
              <div className="mt-1">
                <Badge className={
                  d.action === "approve" ? "bg-green-100 text-green-800"
                  : d.action === "reject" ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
                }>{d.action}</Badge>
              </div>
              {d.notes && <div className="text-xs text-gray-600 mt-2">{d.notes}</div>}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
