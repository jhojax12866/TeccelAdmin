"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Loader2, AlertCircle } from "lucide-react"
import ProductTable from "@/components/admin/product-table"
import AdminLayout from "@/components/admin/admin-layout"
import type { Product } from "@/types"

// URL base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Interfaz para la respuesta de la API
interface ApiProduct {
  id: number
  name: string
  description: string
  price: number
  image: string
  subcategoryId: number
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  subcategory?: {
    id: number
    name: string
    categoryId: number
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [useMockData, setUseMockData] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Cargar productos desde la API
    const loadProducts = async () => {
      setIsLoading(true)
      setError("")

      try {
        // Obtener token de acceso
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          throw new Error("No se encontró el token de acceso")
        }

        // Realizar petición a la API
        const response = await fetch(`${API_BASE_URL}/product`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Error al cargar productos: ${response.status}`)
        }

        const apiProducts: ApiProduct[] = await response.json()

        // Transformar los productos de la API al formato que espera nuestra aplicación
        const formattedProducts: Product[] = apiProducts.map((apiProduct) => {
          // Intentar extraer marca y modelo del nombre
          const nameParts = apiProduct.name.split(" ")
          const brand = nameParts[0] || ""
          let model = nameParts.slice(1).join(" ") || ""
          let storage = ""

          // Intentar extraer almacenamiento si está en el nombre o descripción
          const storageRegex = /(\d+\s*(?:GB|TB))/i
          const storageMatch = apiProduct.name.match(storageRegex) || apiProduct.description.match(storageRegex)
          if (storageMatch) {
            storage = storageMatch[0]
            // Limpiar el modelo si contiene el almacenamiento
            model = model.replace(storageRegex, "").trim()
          }

          return {
            id: String(apiProduct.id),
            brand,
            model,
            storage,
            price: apiProduct.price,
            image: apiProduct.image || "/placeholder.svg",
            featured: false,
            category: apiProduct.subcategory?.name || "",
          }
        })

        setProducts(formattedProducts)
        setUseMockData(false)
      } catch (err: any) {
        console.error("Error al cargar productos:", err)
        setError(err.message || "Error al cargar productos")

        // Si falla la carga desde la API, usar datos simulados
        setProducts([
          {
            id: "1",
            brand: "Samsung",
            model: "Galaxy A35",
            storage: "256GB",
            price: 1299900,
            image: "/samsung/a35.png",
            featured: true,
          },
          {
            id: "2",
            brand: "Tecno",
            model: "Spark 30C",
            storage: "256GB",
            price: 699900,
            image: "/tecno/spark30c.png",
            featured: true,
          },
          {
            id: "3",
            brand: "Xiaomi",
            model: "Redmi 14C",
            storage: "256GB",
            price: 799900,
            image: "/xiaomi/redmi14c.png",
            featured: false,
          },
          {
            id: "4",
            brand: "Xiaomi",
            model: "Redmi Note 14",
            storage: "256GB",
            price: 899900,
            image: "/xiaomi/note14.png",
            featured: true,
          },
          {
            id: "5",
            brand: "ZTE",
            model: "V50 Vita",
            storage: "256GB",
            price: 899900,
            image: "/zte/v50vita.png",
            featured: true,
          },
        ])
        setUseMockData(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [router])

  const filteredProducts = products.filter(
    (product) =>
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.model.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return
    }

    try {
      setIsLoading(true)

      if (useMockData) {
        // Si estamos usando datos simulados, solo actualizar el estado
        setProducts(products.filter((product) => product.id !== id))
      } else {
        // Obtener token de acceso
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          throw new Error("No se encontró el token de acceso")
        }

        // Realizar petición a la API
        const response = await fetch(`${API_BASE_URL}/product/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Error al eliminar el producto: ${response.status}`)
        }

        // Actualizar la lista de productos
        setProducts(products.filter((product) => product.id !== id))
      }
    } catch (err: any) {
      console.error("Error al eliminar el producto:", err)
      alert(err.message || "Error al eliminar el producto")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Productos</h1>
          <button
            onClick={() => router.push("/admin/productos/nuevo")}
            className="flex items-center px-4 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21] transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Producto
          </button>
        </div>

        {error && useMockData && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Usando datos simulados</p>
              <p className="text-sm">{error}. Se están mostrando datos de ejemplo.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e41e26] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#e41e26]" />
              <p className="mt-2 text-gray-600">Cargando productos...</p>
            </div>
          ) : (
            <ProductTable products={filteredProducts} onDelete={handleDeleteProduct} />
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
