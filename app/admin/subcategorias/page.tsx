"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Loader2, AlertCircle, Search } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"

const API_BASE_URL = "http://localhost:3001"

interface Category {
  id: number
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Subcategory {
  id: number
  name: string
  description: string
  categoryId: number
  category?: Category
  isActive: boolean
  
  updatedAt: string
}

export default function SubcategoriasPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentSubcategory, setCurrentSubcategory] = useState<Subcategory | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: 0,
    isActive: true,
  })
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategoryId, setFilterCategoryId] = useState<number>(0)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    setIsLoading(true)
    setError("")

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      // Cargar categorías
      const categoriesResponse = await fetch(`${API_BASE_URL}/catalog/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!categoriesResponse.ok) {
        throw new Error(`Error al cargar categorías: ${categoriesResponse.status}`)
      }

      const categoriesData: Category[] = await categoriesResponse.json()
      setCategories(categoriesData)

      // Cargar todas las subcategorías
      const subcategoriesPromises = categoriesData.map(async (category) => {
        const response = await fetch(`${API_BASE_URL}/catalog/categories/subcategories/by-category/${category.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (response.ok) {
          const data: Subcategory[] = await response.json()
          return data.map((sub) => ({ ...sub, category }))
        }
        return []
      })

      const subcategoriesArrays = await Promise.all(subcategoriesPromises)
      const allSubcategories = subcategoriesArrays.flat()
      setSubcategories(allSubcategories)
    } catch (err: any) {
      console.error("Error al cargar datos:", err)
      setError(`Error al cargar datos: ${err.message}`)
      setCategories([])
      setSubcategories([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSubcategories = subcategories.filter((subcategory) => {
    const matchesSearch =
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.category?.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = filterCategoryId === 0 || subcategory.categoryId === filterCategoryId

    return matchesSearch && matchesCategory
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" || name === "categoryId" ? Number(value) : value,
    }))
  }

  const handleAddNew = () => {
    setCurrentSubcategory(null)
    setFormData({
      name: "",
      description: "",
      categoryId: categories.length > 0 ? categories[0].id : 0,
      isActive: true,
    })
    setIsEditing(true)
    setError("")
  }

  const handleEdit = (subcategory: Subcategory) => {
    setCurrentSubcategory(subcategory)
    setFormData({
      name: subcategory.name,
      description: subcategory.description || "",
      categoryId: subcategory.categoryId,
      isActive: subcategory.isActive,
    })
    setIsEditing(true)
    setError("")
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta subcategoría?")) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      const response = await fetch(`${API_BASE_URL}/catalog/categories/subcategories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al eliminar" }))
        throw new Error(errorData.message || `Error al eliminar subcategoría: ${response.status}`)
      }

      await fetchData()
    } catch (err: any) {
      console.error("Error al eliminar subcategoría:", err)
      setError(err.message || "Error al eliminar subcategoría")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!formData.name.trim()) {
      setError("El nombre de la subcategoría es obligatorio")
      setIsSubmitting(false)
      return
    }

    if (!formData.categoryId || formData.categoryId === 0) {
      setError("Debes seleccionar una categoría")
      setIsSubmitting(false)
      return
    }

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      if (currentSubcategory) {
        const response = await fetch(`${API_BASE_URL}/catalog/categories/subcategories/${currentSubcategory.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId,
            isActive: formData.isActive,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Error al actualizar" }))
          throw new Error(errorData.message || `Error al actualizar subcategoría: ${response.status}`)
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/catalog/categories/subcategories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            categoryId: formData.categoryId,
            isActive: formData.isActive,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Error al crear" }))
          throw new Error(errorData.message || `Error al crear subcategoría: ${response.status}`)
        }
      }

      setIsEditing(false)
      setCurrentSubcategory(null)
      setFormData({
        name: "",
        description: "",
        categoryId: categories.length > 0 ? categories[0].id : 0,
        isActive: true,
      })
      await fetchData()
    } catch (err: any) {
      console.error("Error al guardar subcategoría:", err)
      setError(err.message || "Error al guardar subcategoría")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 px-4 py-2 justify-between">
          <div>
            <h1 className="text-3xl font-bold">Subcategorías</h1>
            <p className="text-muted-foreground">Gestiona las subcategorías de productos</p>
          </div>
          <button
            onClick={handleAddNew}
            disabled={categories.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#e41e26] text-white rounded-lg hover:bg-[#c41820] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Nueva Subcategoría
          </button>
        </div>

        {categories.length === 0 && !isLoading && (
          <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <AlertCircle className="w-5 h-5" />
            <span>Primero debes crear categorías antes de agregar subcategorías.</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {isEditing && (
          <div className="p-6 bg-white border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              {currentSubcategory ? "Editar Subcategoría" : "Nueva Subcategoría"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
                  Categoría
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                  required
                >
                  <option value={0}>Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#e41e26] focus:ring-[#e41e26]"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Activa
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-[#e41e26] text-white rounded-lg hover:bg-[#c41820] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </span>
                  ) : (
                    "Guardar"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setCurrentSubcategory(null)
                    setFormData({
                      name: "",
                      description: "",
                      categoryId: categories.length > 0 ? categories[0].id : 0,
                      isActive: true,
                    })
                    setError("")
                  }}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border rounded-lg p-4">
          <div className="mb-4 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar subcategorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
              />
            </div>
            <select
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
            >
              <option value={0}>Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#e41e26]" />
            </div>
          ) : filteredSubcategories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm || filterCategoryId
                ? "No se encontraron subcategorías con esos filtros"
                : "No hay subcategorías registradas"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">Nombre</th>
                    <th className="text-left p-3 font-semibold">Categoría</th>
                    <th className="text-left p-3 font-semibold">Descripción</th>
                    <th className="text-left p-3 font-semibold">Estado</th>
                    <th className="text-right p-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubcategories.map((subcategory) => (
                    <tr key={subcategory.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{subcategory.name}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {subcategory.category?.name || "Sin categoría"}
                        </span>
                      </td>
                      <td className="p-3">{subcategory.description || "-"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            subcategory.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {subcategory.isActive ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(subcategory)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(subcategory.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
