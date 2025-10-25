"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar si el usuario está logueado al cargar la página
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
  }, [])

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    if (email === "admin@gmail.com" && password === "admin") {
      localStorage.setItem("isLoggedIn", "true")
      setIsLoggedIn(true)
      router.push("/productos/celulares")
    } else {
      throw new Error("Credenciales incorrectas")
    }
  }

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
