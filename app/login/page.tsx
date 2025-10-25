"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"

// URL base de la API (sin el prefijo /API)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Realizar la petición a la API de login
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Respuesta del servidor:", response.status)

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        // Si el servidor responde con un error
        try {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al iniciar sesión")
        } catch (jsonError) {
          // Si no podemos parsear la respuesta como JSON
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
      }

      // Obtener los datos de la respuesta
      const data = await response.json()
      console.log("Datos de respuesta:", data)

      // Guardar el token de acceso en localStorage
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("isLoggedIn", "true")

      // Si hay información del usuario, también la guardamos
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      console.log("Login exitoso")

      // Redirigir al usuario a la página de productos
      router.push("/admin")
    } catch (err: any) {
      console.error("Error de login:", err)
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.")
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Círculos decorativos */}
      <div className="absolute -left-16 top-16 h-64 w-64 rounded-full bg-[#e41e26]/5 z-0"></div>
      <div className="absolute -right-24 bottom-24 h-96 w-96 rounded-full bg-[#e41e26]/5 z-0"></div>
      <div className="absolute left-1/4 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-[#e41e26]/10 z-0"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Administración</h1>
              <p className="text-gray-600 mt-2">Ingresa tus credenciales para acceder al panel</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                      placeholder="ejemplo@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#e41e26] hover:bg-[#c41a21] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e41e26] ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
