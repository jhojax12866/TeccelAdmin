"use client"
import { useAuth } from "@/components/auth-provider"
import { LogOut } from "lucide-react"

export default function AdminNav() {
  const { isLoggedIn, logout } = useAuth()

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="bg-gray-100 py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-sm font-medium">Panel de Administración</div>
        <button onClick={logout} className="flex items-center text-sm text-gray-600 hover:text-[#e41e26]">
          <LogOut className="w-4 h-4 mr-1" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
