"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookingHeader } from "@/components/booking-header"
import { Star, Send } from "lucide-react"
import { useState } from "react"

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const recentFeedback = [
    {
      id: 1,
      date: "2024-02-10",
      rating: 5,
      message: "Great service! Battery swap was quick and efficient.",
    },
    {
      id: 2,
      date: "2024-02-08",
      rating: 4,
      message: "Good experience. Staff was helpful.",
    },
  ]

  const handleSubmit = () => {
    console.log("Feedback submitted:", { rating, feedback })
    setRating(0)
    setFeedback("")
  }

  return (
    <>
      <BookingHeader title="Feedback" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Share Your Feedback</h3>

          <Card className="p-6 mb-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Rate Your Experience</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                    <Star
                      className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7241CE]"
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || !feedback.trim()}
              className="w-full bg-[#7241CE] text-white hover:bg-[#5a2fa0] gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Send Feedback
            </Button>
          </Card>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
          <div className="space-y-4">
            {recentFeedback.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.date}</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{item.message}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
