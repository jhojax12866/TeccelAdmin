"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, X } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import type { Product, SpecificationType } from "@/types"

// Tipos de especificaciones disponibles (simulados)


// Categorías disponibles (simuladas)
const categories = [
  { id: "1", name: "Celulares" },
  { id: "2", name: "Accesorios" },
  { id: "3", name: "Otros" },
]

// Especificaciones simuladas para el producto
const productSpecifications = [
  { typeId: "1", value: "6.5 pulgadas AMOLED" },
  { typeId: "2", value: "Octa-core 2.4GHz" },
  { typeId: "3", value: "8GB" },
  { typeId: "7", value: "5000mAh" },
]

// Productos simulados
const mockProducts = [
  {
    id: "xiaomi-redmi-note-14-256gb",
    brand: "Xiaomi",
    model: "Redmi Note 14",
    storage: "256GB",
    price: 899900,
    image: "/xiaomi/note14.png",
    featured: true,
  },
  {
    id: "xiaomi-redmi-14c-256gb",
    brand: "Xiaomi",
    model: "Redmi 14C",
    storage: "256GB",
    price: 799900,
    image: "/xiaomi/redmi14c.png",
    featured: false,
  },
  {
    id: "samsung-a35-256gb",
    brand: "Samsung",
    model: "Galaxy A35",
    storage: "256GB",
    price: 1299900,
    image: "/samsung/a35.png",
    featured: true,
  },
]

export default function EditarProductoPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [product, setProduct] = useState<Product | null>(null)

  // Estado para el formulario del producto
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    description: "",
    price: "",
    storage: "",
    image: "",
    category: "1",
    featured: false,
  })

  // Estado para las especificaciones
  const [specifications, setSpecifications] = useState<{ typeId: string; value: string }[]>([])

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    // Cargar datos del producto
    const fetchProduct = async () => {
      try {
        // Simular retraso de red
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Buscar producto simulado
        const foundProduct = mockProducts.find((p) => p.id === id)

        if (!foundProduct) {
          throw new Error("Producto no encontrado")
        }

        setProduct(foundProduct)

        // Inicializar el formulario con los datos del producto
        setFormData({
          brand: foundProduct.brand || "",
          model: foundProduct.model || "",
          description: "", // Asumimos que no tenemos descripción en los datos actuales
          price: foundProduct.price.toString() || "",
          storage: foundProduct.storage || "",
          image: foundProduct.image || "",
          category: "1", // Asumimos categoría por defecto
          featured: foundProduct.featured || false,
        })

        // Cargar especificaciones (simuladas para este ejemplo)
        setSpecifications(productSpecifications)
      } catch (error) {
        console.error("Error al cargar el producto:", error)
        setError("No se pudo cargar el producto. Inténtalo de nuevo.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSpecificationChange = (index: number, field: "typeId" | "value", value: string) => {
    const newSpecifications = [...specifications]
    newSpecifications[index][field] = value
    setSpecifications(newSpecifications)
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { typeId: "", value: "" }])
  }

  const removeSpecification = (index: number) => {
    const newSpecifications = [...specifications]
    newSpecifications.splice(index, 1)
    setSpecifications(newSpecifications)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      // Validar campos requeridos
      if (!formData.brand || !formData.model || !formData.price) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      // Validar que el precio sea un número
      if (isNaN(Number(formData.price))) {
        throw new Error("El precio debe ser un número válido")
      }

      // Filtrar especificaciones vacías
      const validSpecifications = specifications.filter((spec) => spec.typeId && spec.value)

      // Crear objeto de producto actualizado
      const updatedProduct = {
        ...product,
        brand: formData.brand,
        model: formData.model,
        storage: formData.storage,
        price: Number(formData.price),
        image: formData.image || "/placeholder.svg",
        featured: formData.featured,
      }

      console.log("Producto actualizado:", updatedProduct)
      console.log("Especificaciones:", validSpecifications)

      // Simular retraso de red
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En un caso real, aquí se enviaría el producto actualizado al backend
      // Y se actualizarían las especificaciones siguiendo el mismo flujo que en la creación:
      // 1. Crear especificación con /specification
      // 2. Asociar al producto con /product-specification

      // Redirigir a la lista de productos
      router.push("/admin")
    } catch (err: any) {
      setError(err.message || "Error al actualizar el producto")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center h-full">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#e41e26] border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Cargando producto...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4">
            <p>Producto no encontrado. El producto puede haber sido eliminado o no existe.</p>
            <button
              onClick={() => router.push("/admin")}
              className="mt-4 px-4 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21]"
            >
              Volver a la lista de productos
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Editar Producto</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">{error}</div>}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica del producto */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Información del Producto</h2>

                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                    Marca <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    required
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    required
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  />
                </div>

                <div>
                  <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-1">
                    Almacenamiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="storage"
                    name="storage"
                    required
                    value={formData.storage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    URL de la Imagen
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#e41e26] focus:ring-[#e41e26] border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                    Producto destacado
                  </label>
                </div>
              </div>

              {/* Especificaciones del producto */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-lg font-semibold">Especificaciones</h2>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="flex items-center text-sm text-[#e41e26] hover:text-[#c41a21]"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir
                  </button>
                </div>

                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="flex-1">
                      <select
                        value={spec.typeId}
                        onChange={(e) => handleSpecificationChange(index, "typeId", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                      >
                       
                        
                      </select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                        placeholder="Valor"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="text-gray-400 hover:text-red-500"
                      title="Eliminar especificación"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                <div className="pt-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Producto
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`px-4 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21] ${
                  isSaving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSaving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
