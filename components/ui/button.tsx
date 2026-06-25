import * as React from "react"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "lg"
  children: React.ReactNode
}

export function Button({
  variant = "default",
  size = "default",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200"

  const variants = {
    default: "bg-[#2563EB] text-white hover:bg-[#1D4ED8]",
    outline:
      "border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-base",
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}