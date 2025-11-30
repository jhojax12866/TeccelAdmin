"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import ProductTable from "@/components/admin/product-table"
import AdminLayout from "@/components/admin/admin-layout"
import { PaginatedResponse, PaginationMetadata, Product, ApiProductRaw } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function AdminPage() {
  const router = useRouter()
  
  const [products, setProducts] = useState<Product[]>([])
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Estados de control
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  
  // 1. NUEVO ESTADO: Cantidad por página (default 10)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  const [useMockData, setUseMockData] = useState(false)

  // 2. ACTUALIZAMOS EL EFECTO: Ahora escucha también 'itemsPerPage'
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts()
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, page, itemsPerPage]) // <--- Se recarga si cambia cualquiera de estos 3

  const loadProducts = async () => {
    setIsLoading(true)
    setError("")

    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      if (!isLoggedIn) {
         // router.push("/login") 
      }

      const accessToken = localStorage.getItem("accessToken")
      
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: itemsPerPage.toString(), // <--- Usamos la variable de estado aquí
      })
      
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`${API_BASE_URL}/catalog/products/products-paginated?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.status}`)
      }

      const data: PaginatedResponse<ApiProductRaw> = await response.json()

      const formattedProducts: Product[] = data.rows.map((item) => {
        const mainImage = item.images && item.images.length > 0 
          ? item.images[0].imageUrl 
          : "/placeholder.svg"

        const catObj = item.productSubcategories?.[0]?.subcategory?.category
        const subCatObj = item.productSubcategories?.[0]?.subcategory
        
        const categoryLabel = catObj ? `${catObj.name}` : "Sin categoría"
        const subCategoryLabel = subCatObj ? ` - ${subCatObj.name}` : ""

        return {
          id: String(item.id),
          name: item.name, 
          code: item.code,
          description: item.description,
          price: Number(item.price),
          priceDiscount: item.pricediscount ? Number(item.pricediscount) : undefined,
          stock: item.stock,
          image: mainImage,
          category: categoryLabel + subCategoryLabel, 
          isActive: item.isActive
        }
      })

      setProducts(formattedProducts)
      setMetadata(data.metadata)
      setUseMockData(false)

    } catch (err: any) {
      console.error("Error al cargar productos:", err)
      setError(err.message || "Error de conexión")
      
      // MOCK DATA (Solo para ejemplo visual si falla API)
      setProducts([
        {
          id: "1",
          name: "iPhone 15 Pro",
          code: "IPHONE15-256",
          price: 999.99,
          stock: 50,
          image: "/placeholder.svg",
          category: "Electrónica - Smartphones",
          isActive: true
        }
      ])
      setUseMockData(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) return

    try {
      setIsLoading(true)
      if (!useMockData) {
        const accessToken = localStorage.getItem("accessToken")
        await fetch(`${API_BASE_URL}/product/${id}`, { 
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` }
        })
      }
      loadProducts()
    } catch (err) {
      alert("Error al eliminar")
    } finally {
      setIsLoading(false)
    }
  }

  // Función manejadora para el cambio de items por página
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setPage(1) // Importante: Resetear a la página 1 al cambiar la cantidad
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
              <p className="font-medium">Modo Offline / Error</p>
              <p className="text-sm">{error}. Mostrando datos de ejemplo.</p>
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
                placeholder="Buscar por nombre, código..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e41e26] focus:border-transparent"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPage(1) 
                }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#e41e26]" />
              <p className="mt-2 text-gray-600">Cargando catálogo...</p>
            </div>
          ) : (
            <>
              <ProductTable products={products || []} onDelete={handleDeleteProduct} />

              {/* 3. CONTROLES DE PAGINACIÓN ACTUALIZADOS */}
              {metadata && !useMockData && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4 border-t pt-4 gap-4 sm:gap-0">
                  
                  {/* Selector de Items por página */}
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">Mostrar:</span>
                    <select
                      value={itemsPerPage}
                      onChange={handleItemsPerPageChange}
                      className="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#e41e26] bg-white cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                    </select>
                    <span className="ml-2">por página</span>
                  </div>

                  {/* Texto informativo */}
                  <div className="text-sm text-gray-500">
                    Página {metadata.currentPage} de {metadata.totalPages} ({metadata.totalItems} total)
                  </div>

                  {/* Botones Anterior/Siguiente */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPage(p => (metadata.totalPages > p ? p + 1 : p))}
                      disabled={page >= metadata.totalPages}
                      className="p-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Siguiente"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}