"use client"

import Link from "next/link"
import { User } from "lucide-react"

interface LoginButtonProps {
  className?: string
}

export default function LoginButton({ className = "" }: LoginButtonProps) {
  return (
    <Link
      href="/login"
      className={`flex items-center text-[#e41e26] hover:text-[#c41a21] font-medium transition-colors ${className}`}
    >
      <User className="w-5 h-5 mr-1" />
      <span>LOGIN</span>
    </Link>
  )
}
