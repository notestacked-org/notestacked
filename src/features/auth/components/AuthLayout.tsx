"use client"

import type React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
  sideContent?: React.ReactNode
}

export function AuthLayout({ children, sideContent }: AuthLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 overflow-y-clip">
        <div className="w-full">
          {/* Logo */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900">notesTacked</h2>
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right Side - Customizable Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-12 overflow-y-clip">
        <div className="text-center max-w-md">
          {sideContent ? (
            sideContent
          ) : (
            <>
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 bg-opacity-10 mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Collaborate Smarter</h3>
              <p className="text-gray-600 leading-relaxed">
                Share notes, manage projects, and collaborate with your team in real-time on notesTacked.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
