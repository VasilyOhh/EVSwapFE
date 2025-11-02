"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { User, Mail, Lock, ArrowLeft, MapPin, ChevronDown } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

const VIETNAM_PROVINCES = [
  "Tuyên Quang", "Cao Bằng", "Lai Châu", "Lào Cai", "Thái Nguyên",
  "Điện Biên", "Lạng Sơn", "Sơn La", "Phú Thọ", "Hà Nội",
  "Hải Phòng", "Bắc Ninh", "Quảng Ninh", "Hưng Yên", "Ninh Bình",
  "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Trị", "Huế",
  "Đà Nẵng", "Quảng Ngãi", "Gia Lai", "Đắk Lắk", "Khánh Hòa",
  "Lâm Đồng", "Đồng Nai", "Tây Ninh", "TP. Hồ Chí Minh", "Đồng Tháp",
  "An Giang", "Vĩnh Long", "Cần Thơ", "Cà Mau",
]

export default function SignupPage() {
  const { login, isLoggedIn, isLoading } = useAuth()
  const router = useRouter()

  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  })

  const [agreed, setAgreed] = useState(false)
  const [provinceSearch, setProvinceSearch] = useState("")
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false)
  const [filteredProvinces, setFilteredProvinces] = useState(VIETNAM_PROVINCES)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, isLoading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleProvinceSearch = (value: string) => {
    setProvinceSearch(value)
    const filtered = VIETNAM_PROVINCES.filter((province) => province.toLowerCase().includes(value.toLowerCase()))
    setFilteredProvinces(filtered)
  }

  const handleProvinceSelect = (province: string) => {
    setFormData((prev) => ({ ...prev, address: province }))
    setProvinceSearch(province)
    setShowProvinceDropdown(false)
  }

  const isFormValid =
    formData.userName.trim() &&
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    formData.address.trim() &&
    formData.password.trim() &&
    formData.confirmPassword.trim() &&
    formData.password === formData.confirmPassword &&
    agreed

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!agreed) {
      alert("You must agree to the Terms and Privacy Policy before signing up.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formData.userName,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          password: formData.password,
        }),
      })

      if (res.ok) {
        alert("Account created successfully! Please sign in with your credentials.")
        router.push("/signin")
      } else {
        const errData = await res.text()
        alert("Signup failed: " + errData)
      }
    } catch (err) {
      alert("Error: " + err)
    }
  }

  // FIX: Dùng useCallback để tránh stale closure
  const handleGoogleSignIn = useCallback(async (response: any) => {
    console.log("🔐 Google Sign-In Response:", response)
    setIsGoogleLoading(true)

    try {
      const googleToken = response.credential

      console.log("📤 Sending token to backend...")
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      })

      const data = await res.json()
      console.log("📥 Backend response:", data)

      if (res.ok) {
        if (data.token) {
          localStorage.setItem("authToken", data.token)
          localStorage.setItem("userRole", data.role)
          localStorage.setItem("userName", data.username)
          localStorage.setItem("userEmail", data.email)
        }

        alert("Login to Google successful!")
        window.location.href = "/"
      } else {
        alert("Google login failed: " + (data.message || data || "Unknown error"))
      }
    } catch (err) {
      console.error("Google login error:", err)
      alert("Error: " + err)
    } finally {
      setIsGoogleLoading(false)
    }
  }, [])

  // Load và initialize Google Sign-In
  useEffect(() => {
    // Kiểm tra script đã load chưa
    if (window.google?.accounts?.id) {
      setGoogleScriptLoaded(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true

    script.onload = () => {
      console.log("Google script loaded")
      setGoogleScriptLoaded(true)
    }

    script.onerror = () => {
      console.error("❌ Failed to load Google script")
    }

    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Initialize Google button khi script đã load
  useEffect(() => {
    if (!googleScriptLoaded || !window.google) {
      console.log("⏳ Waiting for Google script...")
      return
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

    if (!clientId || clientId === "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
      console.error("Google Client ID not configured!")
      return
    }

    try {
      console.log("Initializing Google Sign-In...")

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleSignIn,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      const buttonDiv = document.getElementById("googleSignInButton")
      if (buttonDiv) {
        window.google.accounts.id.renderButton(
          buttonDiv,
          {
            theme: "outline",
            size: "large",
            width: 400,
            text: "continue_with",
            shape: "rectangular",
          }
        )
        console.log("Google button rendered")
      } else {
        console.error("Button div not found")
      }
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error)
    }
  }, [googleScriptLoaded, handleGoogleSignIn])

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#A2F200]">
            <Zap className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EVSwap</h1>
          <p className="text-gray-600">Battery Swap Station Management</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Sign up to access your EVSwap account</p>
          </div>

          {/* Google Sign-In Button */}
          <div className="mb-6">
            <div
              id="googleSignInButton"
              className="flex justify-center items-center min-h-[44px]"
              style={{
                opacity: isGoogleLoading ? 0.5 : 1,
                pointerEvents: isGoogleLoading ? 'none' : 'auto'
              }}
            />
            {!googleScriptLoaded && (
              <div className="text-center text-sm text-gray-500">
                Loading Google Sign-In...
              </div>
            )}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 uppercase tracking-wide">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-900 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Enter a username"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  className="pl-3 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Search for province/city"
                  className="pl-10 pr-10 h-12"
                  value={provinceSearch}
                  onChange={(e) => handleProvinceSearch(e.target.value)}
                  onFocus={() => setShowProvinceDropdown(true)}
                  autoComplete="off"
                />
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                {showProvinceDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredProvinces.length > 0 ? (
                      filteredProvinces.map((province) => (
                        <button
                          key={province}
                          type="button"
                          className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors text-gray-700"
                          onClick={() => handleProvinceSelect(province)}
                        >
                          {province}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500 text-sm">City/Province not found.</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="pl-10 h-12"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(!!checked)} />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-purple-600 hover:text-purple-700 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-purple-600 hover:text-purple-700 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className={`w-full h-12 text-base ${isFormValid ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              disabled={!isFormValid}
            >
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign In here
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center text-gray-600 hover:text-gray-900 mt-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

// TypeScript types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement | null, config: any) => void
          prompt: () => void
        }
      }
    }
  }
}