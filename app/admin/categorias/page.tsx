"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Loader2, AlertCircle, Search } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"

// URL base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Interfaz para categorías según la API
interface Category {
  id: number
  name: string
  description: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
}

// Interfaz para la respuesta paginada
interface PaginatedResponse {
  rows: Category[]
  metadata: {
    itemsPerPage: number
    totalPages: number
    totalItems: number
    currentPage: number
    nextPage: number | null
    searchTerm: string
  }
}

export default function CategoriasPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Datos simulados para mostrar cuando la API falla
  const mockCategories: Category[] = [
    { id: 1, name: "Celulares", description: "Smartphones y teléfonos móviles" },
    { id: 2, name: "Accesorios", description: "Accesorios para dispositivos móviles" },
    { id: 3, name: "Otros", description: "Otros productos electrónicos" },
  ]

  // Cargar categorías
  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    fetchCategories()
  }, [router, currentPage, itemsPerPage])

  const fetchCategories = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Obtener token de acceso
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      // Realizar petición a la API
      const response = await fetch(
        `${API_BASE_URL}/category/with-pagination?page=${currentPage}&perPage=${itemsPerPage}${
          searchTerm ? `&search=${searchTerm}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error(`Error al cargar categorías: ${response.status}`)
      }

      const data: PaginatedResponse = await response.json()

      setCategories(data.rows)
      setTotalItems(data.metadata.totalItems)
      setTotalPages(data.metadata.totalPages)
    } catch (err: any) {
      console.error("Error al cargar categorías:", err)
      setError("Error al cargar categorías. Usando datos simulados.")
      setCategories(mockCategories)
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar categorías por término de búsqueda
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddNew = () => {
    setCurrentCategory(null)
    setFormData({ name: "", description: "" })
    setIsEditing(true)
    setError("")
  }

  const handleEdit = (category: Category) => {
    setCurrentCategory(category)
    setFormData({ name: category.name, description: category.description || "" })
    setIsEditing(true)
    setError("")
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Obtener token de acceso
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      // Realizar petición a la API
      const response = await fetch(`${API_BASE_URL}/category/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar categoría: ${response.status}`)
      }

      // Actualizar estado local
      setCategories(categories.filter((cat) => cat.id !== id))

      // Recargar categorías si estamos en la última página y se eliminó el último elemento
      if (filteredCategories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      } else {
        fetchCategories()
      }
    } catch (err: any) {
      console.error("Error al eliminar categoría:", err)
      setError(err.message || "Error al eliminar categoría")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Validar campos
    if (!formData.name.trim()) {
      setError("El nombre de la categoría es obligatorio")
      setIsSubmitting(false)
      return
    }

    try {
      // Obtener token de acceso
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      if (currentCategory) {
        // Actualizar categoría existente
        const response = await fetch(`${API_BASE_URL}/category/update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            id: currentCategory.id,
            name: formData.name,
            description: formData.description,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error al actualizar categoría: ${response.status}`)
        }
      } else {
        // Crear nueva categoría
        const response = await fetch(`${API_BASE_URL}/category/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error al crear categoría: ${response.status}`)
        }
      }

      // Resetear formulario
      setIsEditing(false)
      setCurrentCategory(null)
      setFormData({ name: "", description: "" })

      // Recargar categorías
      fetchCategories()
    } catch (err: any) {
      console.error("Error al guardar categoría:", err)
      setError(err.message || "Error al guardar categoría")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Resetear a la primera página al buscar
    fetchCategories()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
          <button
            onClick={handleAddNew}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Categoría
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#e41e26]" />
              <p className="mt-2 text-gray-600">Cargando categorías...</p>
            </div>
          ) : isEditing ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">{currentCategory ? "Editar Categoría" : "Nueva Categoría"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={isSubmitting}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21] disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Guardando...
                        </>
                      ) : (
                        "Guardar"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {/* Buscador */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar categorías..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  />
                  <button
                    type="submit"
                    className="absolute inset-y-0 right-0 px-4 py-2 bg-[#e41e26] text-white rounded-r-md hover:bg-[#c41a21]"
                  >
                    Buscar
                  </button>
                </div>
              </form>

              {filteredCategories.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay categorías disponibles.</p>
                  <button
                    onClick={handleAddNew}
                    className="mt-4 px-4 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21]"
                  >
                    Añadir Categoría
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nombre
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Descripción
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
                      {filteredCategories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {category.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(category)}
                                disabled={isSubmitting}
                                className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                title="Editar categoría"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(category.id)}
                                disabled={isSubmitting}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Eliminar categoría"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                      <div className="flex justify-between w-full">
                        <div>
                          <p className="text-sm text-gray-700">
                            Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{" "}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> de{" "}
                            <span className="font-medium">{totalItems}</span> resultados
                          </p>
                        </div>
                        <div>
                          <nav
                            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                            aria-label="Pagination"
                          >
                            <button
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === 1
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              <span className="sr-only">Anterior</span>
                              &laquo;
                            </button>

                            {Array.from({ length: totalPages }).map((_, index) => (
                              <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
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
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                                currentPage === totalPages
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              <span className="sr-only">Siguiente</span>
                              &raquo;
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
