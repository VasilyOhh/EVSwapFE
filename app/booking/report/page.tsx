"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookingHeader } from "@/components/booking-header"
import { AlertTriangle, Mail, Phone, MessageSquare, HelpCircle } from "lucide-react"

export default function ReportPage() {
  const faqs = [
    {
      question: "How do I report a technical issue?",
      answer: "Go to the Report section, describe the issue, and our support team will investigate it immediately.",
    },
    {
      question: "What should I report to support?",
      answer: "Report any technical problems, billing issues, safety concerns, or service quality problems.",
    },
    {
      question: "How long does it take to get a response?",
      answer: "We aim to respond to all reports within 24 hours. Urgent issues are prioritized.",
    },
    {
      question: "Can I track my report status?",
      answer: "Yes, you can view the status of all submitted reports in the Reports section.",
    },
  ]

  return (
    <>
      <BookingHeader title="Report" />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl">
          <div className="grid grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <Mail className="w-8 h-8 text-[#7241CE] mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
              <p className="text-sm text-gray-600 mb-4">support@evdriver.com</p>
              <Button variant="outline" size="sm">
                Contact Us
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <Phone className="w-8 h-8 text-[#7241CE] mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
              <p className="text-sm text-gray-600 mb-4">1-800-EV-SWAP</p>
              <Button variant="outline" size="sm">
                Call Now
              </Button>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <MessageSquare className="w-8 h-8 text-[#7241CE] mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
              <p className="text-sm text-gray-600 mb-4">Available 24/7</p>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </Card>
          </div>

          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Report an Issue</h3>
            </div>

            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7241CE]">
                    <option>Select an issue type...</option>
                    <option>Technical Problem</option>
                    <option>Billing Issue</option>
                    <option>Safety Concern</option>
                    <option>Service Quality</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Please describe the issue in detail..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7241CE]"
                    rows={4}
                  />
                </div>

                <Button className="w-full bg-red-500 text-white hover:bg-red-600">Submit Report</Button>
              </div>
            </Card>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h3>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <HelpCircle className="w-5 h-5 text-[#7241CE] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
