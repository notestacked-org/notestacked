

import type React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="font-sans antialiased bg-white text-foreground">
        {children}
    </div>
  )
}
