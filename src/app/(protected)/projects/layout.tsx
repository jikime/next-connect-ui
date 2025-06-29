import type React from "react"

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full p-6">
      {children}
    </div>
  )
}
