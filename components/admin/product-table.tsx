"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/types"

interface ProductTableProps {
  products: Product[]
  onDelete: (id: string) => void
}

export default function ProductTable({ products, onDelete }: ProductTableProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortField, setSortField] = useState<keyof Product>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Calcular índices para paginación
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  // Ordenar productos
  const sortedProducts = [...products].sort((a, b) => {
 
    return 0
  })

  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem)

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Cambiar ordenamiento
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Confirmar eliminación
  const confirmDelete = (id: string) => {
    onDelete(id)
  }

  return (
    <div>
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron productos.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("id")}
                  >
                    ID
                    {sortField === "id" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Imagen
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("brand")}
                  >
                    Marca
                    {sortField === "brand" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("model")}
                  >
                    Modelo
                    {sortField === "model" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("storage")}
                  >
                    Almacenamiento
                    {sortField === "storage" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("price")}
                  >
                    Precio
                    {sortField === "price" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={`${product.brand} ${product.model}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.brand}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.model}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.storage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push(`/producto/${product.id}`)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver producto"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/productos/editar/${product.id}`)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar producto"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar producto"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {Math.ceil(products.length / itemsPerPage) > 1 && (
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{" "}
                    <span className="font-medium">{Math.min(indexOfLastItem, products.length)}</span> de{" "}
                    <span className="font-medium">{products.length}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Anterior</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === index + 1
                            ? "z-10 bg-[#e41e26] border-[#e41e26] text-white"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(products.length / itemsPerPage)}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === Math.ceil(products.length / itemsPerPage)
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Siguiente</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
