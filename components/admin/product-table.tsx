"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image" // Usamos Next/Image como tenías
import { Edit, Trash2, Eye, ArrowUpDown, Tag } from "lucide-react"
import type { Product } from "@/types"

interface ProductTableProps {
  products: Product[]
  onDelete: (id: string) => void
}

export default function ProductTable({ products = [], onDelete }: ProductTableProps) {
  const router = useRouter()
  // Mantenemos solo el ordenamiento visual de la página actual
  const [sortField, setSortField] = useState<keyof Product>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Función interna para formatear precio (o puedes importar la de @/lib/utils si prefieres)
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Lógica de ordenamiento simple (solo ordena los items visibles)
  const sortedProducts = [...products].sort((a, b) => {
    // Manejo seguro de valores undefined
    const aValue = a[sortField] || ""
    const bValue = b[sortField] || ""

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Función para manejar el clic en encabezados
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Icono de ordenamiento
  const SortIcon = ({ field }: { field: keyof Product }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-50" />
    return <span className="ml-1 text-gray-700">{sortDirection === "asc" ? "↑" : "↓"}</span>
  }

  return (
    <div>
      {!products || products.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-gray-500">No se encontraron productos en esta página.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* ID Column */}
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID / SKU
                    <SortIcon field="id" />
                  </div>
                </th>

                {/* Image Column (No sortable) */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>

                {/* Name Column */}
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Producto
                    <SortIcon field="name" />
                  </div>
                </th>

                {/* Category Column */}
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("category")}
                >
                  <div className="flex items-center">
                    Categoría
                    <SortIcon field="category" />
                  </div>
                </th>

                {/* Price Column */}
                <th
                  scope="col"
                  className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("price")}
                >
                  <div className="flex items-center">
                    Precio
                    <SortIcon field="price" />
                  </div>
                </th>

                {/* Actions Column */}
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  
                  {/* ID / SKU Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">#{product.id}</span>
                      <span className="text-xs text-gray-500">{product.code}</span>
                    </div>
                  </td>

                  {/* Image Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative h-12 w-12 border border-gray-200 rounded-md overflow-hidden bg-white">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>

                  {/* Name Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={product.name}>
                            {product.name}
                        </span>
                        {!product.isActive && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 w-fit mt-1">
                            Inactivo
                            </span>
                        )}
                    </div>
                  </td>

                  {/* Category Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                        <Tag className="w-3 h-3 mr-1.5 text-gray-400" />
                        {product.category || "General"}
                    </div>
                  </td>

                  {/* Price Cell */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                        {product.priceDiscount ? (
                            <>
                                <span className="text-sm font-bold text-red-600">
                                    {formatPrice(product.priceDiscount)}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                    {formatPrice(product.price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-sm text-gray-900">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                  </td>

                  {/* Actions Cell */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/producto/${product.id}`)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="Ver detalle"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/productos/editar/${product.id}`)}
                        className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded"
                        title="Editar"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                        title="Eliminar"
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
      )}
      {/* NOTA: La paginación se ha eliminado de aquí porque ya está en el componente padre (AdminPage) */}
    </div>
  )
}