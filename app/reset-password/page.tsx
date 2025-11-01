"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Zap, ArrowLeft, Lock, CheckCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    // Chỉ redirect nếu KHÔNG có token và user đã login
    if (!isLoading && isLoggedIn && !token) {
      router.push("/")
    }
  }, [isLoggedIn, isLoading, router])


  const isFormValid = password.trim() && confirmPassword.trim() && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }

    try {
      // Call API to reset password with token
      const response = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: password,
          confirmPassword: confirmPassword,  // Thêm confirmPassword ở đây
        }),
      })


      if (!response.ok) {
        let errorMessage = "Failed to reset password"

        try {
          // Thử đọc JSON
          const errorData = await response.clone().json()
          if (errorData && errorData.message) {
            errorMessage = errorData.message
          }
        } catch {
          // Nếu không phải JSON, đọc text thuần
          const text = await response.text()
          if (text) {
            errorMessage = text
          }
        }

        throw new Error(errorMessage)
      }

      setSubmitted(true)
    } catch (error) {
      console.error("Error:", error)
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#A2F200]">
            <Zap className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EVSwap</h1>
          <p className="text-gray-600">Battery Swap Station Management</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!submitted ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                <p className="text-gray-600">Enter your new password below</p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className={`w-full h-12 text-base ${isFormValid && !loading
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                    }`}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Remember your password?{" "}
                <Link href="/signin" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign In here
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successfully</h2>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>

              <Button
                onClick={() => router.push("/signin")}
                className="w-full h-12 text-base bg-purple-600 hover:bg-purple-700 text-white"
              >
                Back to Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 mt-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}
