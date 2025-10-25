"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Home, Package, Users, Settings, LogOut, Menu, X, ChevronDown, LayoutDashboard } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(true)
  const [userName, setUserName] = useState("Admin")

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      router.push("/login")
      return
    }

    // Intentar obtener información del usuario
    try {
      const userInfo = localStorage.getItem("user")
      if (userInfo) {
        const user = JSON.parse(userInfo)
        if (user.name) {
          setUserName(user.name)
        }
      }
    } catch (error) {
      console.error("Error al obtener información del usuario:", error)
    }

    // Detectar si es móvil
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [router])

  const handleLogout = () => {
    // Eliminar tokens y datos de usuario
    localStorage.removeItem("accessToken")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")

    // Redirigir al login
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link href="/admin" className="flex items-center">
            <span className="text-xl font-bold text-[#e41e26]">TECCEL ADMIN</span>
          </Link>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
              <X className="h-6 w-6 text-gray-500" />
            </button>
          )}
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            <li>
              <Link href="/admin" className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100">
                <LayoutDashboard className="h-5 w-5 mr-3 text-gray-500" />
                Dashboard
              </Link>
            </li>

            <li>
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-3 text-gray-500" />
                  Productos
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${isProductsOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProductsOpen && (
                <ul className="pl-12 mt-2 space-y-1">
                  <li>
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100">
                      Todos los Productos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/productos/nuevo"
                      className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                    >
                      Añadir Producto
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/admin/categorias"
                      className="block px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                    >
                      Categorías
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/admin/usuarios"
                className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <Users className="h-5 w-5 mr-3 text-gray-500" />
                Usuarios
              </Link>
            </li>

            <li>
              <Link
                href="/admin/configuracion"
                className="flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 mr-3 text-gray-500" />
                Configuración
              </Link>
            </li>
          </ul>

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5 mr-3 text-gray-500" />
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(true)} className="mr-4 lg:hidden">
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
          )}

          <div className="flex items-center ml-auto">
            <Link href="/" className="flex items-center mr-4 text-gray-700 hover:text-[#e41e26]">
              <Home className="h-5 w-5" />
              <span className="ml-2">Ver Tienda</span>
            </Link>

            <div className="relative">
              <button className="flex items-center text-gray-700 focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium">{userName.charAt(0)}</span>
                </div>
                <span className="ml-2">{userName}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
