"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, Loader2, AlertCircle, Upload, Trash2 } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { categoryService } from "@/lib/api/services/category.service"
import { attributeService } from "@/lib/api/services/attribute.service"
import { productService } from "@/lib/api/services/product.service"
import type {
  Category,
  Subcategory,
  AttributeGroup,
  Attribute,
  CreateProductRequest,
  ProductAttributeValue,
} from "@/lib/api/types"

export default function NuevoProductoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [attributeGroups, setAttributeGroups] = useState<AttributeGroup[]>([])
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estado para el formulario del producto
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    price: "",
    priceDiscount: "",
    stock: "",
    isActive: true,
    categoryId: "",
    subcategoryIds: [] as number[],
  })

  // Estado para los valores de atributos agrupados
  const [attributeValues, setAttributeValues] = useState<ProductAttributeValue[]>([])

  // Filtrar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (formData.categoryId && subcategories.length > 0) {
      const categoryId = Number(formData.categoryId)
      const filtered = subcategories.filter((sub) => sub.categoryId === categoryId)
      setFilteredSubcategories(filtered)

      // Limpiar subcategorías seleccionadas si no pertenecen a la nueva categoría
      setFormData((prev) => ({
        ...prev,
        subcategoryIds: prev.subcategoryIds.filter((id) => filtered.some((sub) => sub.id === id)),
      }))
    } else {
      setFilteredSubcategories([])
      setFormData((prev) => ({ ...prev, subcategoryIds: [] }))
    }
  }, [formData.categoryId, subcategories])

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingData(true)
      setError("")

      try {
        // Cargar categorías y grupos de atributos
        const [categoriesData, attributeGroupsData] = await Promise.all([
          categoryService.getAllCategories(),
          attributeService.getAllAttributeGroups(),
        ])

        setCategories(categoriesData)
        setAttributeGroups(attributeGroupsData)

        // Cargar todas las subcategorías de todas las categorías
        const allSubcategories: Subcategory[] = []
        for (const category of categoriesData) {
          try {
            const subs = await categoryService.getSubcategoriesByCategory(category.id)
            allSubcategories.push(...subs)
          } catch (err) {
            console.error(`Error loading subcategories for category ${category.id}:`, err)
          }
        }
        setSubcategories(allSubcategories)

        // Cargar todos los atributos de todos los grupos
        const allAttributes: Attribute[] = []
        for (const group of attributeGroupsData) {
          try {
            const attrs = await attributeService.getAttributesByGroup(group.id)
            allAttributes.push(...attrs)
          } catch (err) {
            console.error(`Error loading attributes for group ${group.id}:`, err)
          }
        }
        setAttributes(allAttributes)
      } catch (err: any) {
        console.error("Error al cargar datos:", err)
        setError(err.message || "Error al cargar los datos necesarios")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchInitialData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubcategoryToggle = (subcategoryId: number) => {
    setFormData((prev) => {
      const isSelected = prev.subcategoryIds.includes(subcategoryId)
      return {
        ...prev,
        subcategoryIds: isSelected
          ? prev.subcategoryIds.filter((id) => id !== subcategoryId)
          : [...prev.subcategoryIds, subcategoryId],
      }
    })
  }

  const handleAttributeValueChange = (attributeId: number, value: string) => {
    setAttributeValues((prev) => {
      const existing = prev.find((av) => av.attributeId === attributeId)
      if (existing) {
        if (value === "") {
          // Remover si el valor está vacío
          return prev.filter((av) => av.attributeId !== attributeId)
        }
        // Actualizar valor existente
        return prev.map((av) => (av.attributeId === attributeId ? { ...av, value } : av))
      } else {
        // Agregar nuevo valor
        if (value === "") return prev
        return [...prev, { attributeId, value }]
      }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPreviews: string[] = []
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newPreviews.push(reader.result as string)
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validar campos requeridos
      if (!formData.name || !formData.code || !formData.price) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      if (formData.subcategoryIds.length === 0) {
        throw new Error("Debes seleccionar al menos una subcategoría")
      }

      // Validar que el precio sea un número válido
      if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        throw new Error("El precio debe ser un número válido mayor a 0")
      }

      // Validar stock
      if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
        throw new Error("El stock debe ser un número válido mayor o igual a 0")
      }

      // Crear objeto de producto
      const productData: CreateProductRequest = {
        name: formData.name,
        description: formData.description || undefined,
        code: formData.code,
        price: Number(formData.price),
        priceDiscount: formData.priceDiscount ? Number(formData.priceDiscount) : undefined,
        stock: Number(formData.stock),
        isActive: formData.isActive,
        images: imagePreviews, // En producción, aquí deberías subir las imágenes a un servidor
        subcategoryIds: formData.subcategoryIds,
        attributeValues: attributeValues,
      }

      // Crear producto
      const response = await productService.createProduct(productData)

      setSuccess("Producto creado exitosamente")

      // Resetear formulario
      setFormData({
        name: "",
        description: "",
        code: "",
        price: "",
        priceDiscount: "",
        stock: "",
        isActive: true,
        categoryId: "",
        subcategoryIds: [],
      })
      setAttributeValues([])
      setImagePreviews([])

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push("/admin")
      }, 2000)
    } catch (err: any) {
      console.error("Error al crear producto:", err)
      setError(err.message || "Error al crear el producto")
    } finally {
      setIsLoading(false)
    }
  }

  // Agrupar atributos por grupo
  const attributesByGroup = attributeGroups.map((group) => ({
    group,
    attributes: attributes.filter((attr) => attr.attributeGroupId === group.id),
  }))

  if (isLoadingData) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#e41e26]" />
            <p className="mt-2 text-gray-600">Cargando información...</p>
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
          <h1 className="text-2xl font-bold">Nuevo Producto</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{success}</div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna izquierda - Información básica */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Información Básica</h2>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    placeholder="Ej: Samsung Galaxy A35 256GB"
                  />
                </div>

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                    Código del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    required
                    value={formData.code}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    placeholder="Ej: SAM-A35-256"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Precio <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label htmlFor="priceDiscount" className="block text-sm font-medium text-gray-700 mb-1">
                      Precio con Descuento
                    </label>
                    <input
                      type="number"
                      id="priceDiscount"
                      name="priceDiscount"
                      min="0"
                      step="0.01"
                      value={formData.priceDiscount}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    placeholder="Descripción detallada del producto..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#e41e26] focus:ring-[#e41e26] border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Producto activo
                  </label>
                </div>

                {/* Imágenes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del Producto</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center py-4 text-gray-600 hover:text-gray-900"
                    >
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-sm">Haz clic para subir imágenes</span>
                    </button>

                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={preview || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              width={150}
                              height={150}
                              className="rounded-md object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Columna derecha - Categorización y Atributos */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Categorización</h2>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.categoryId && filteredSubcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategorías <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
                      {filteredSubcategories.map((subcategory) => (
                        <label
                          key={subcategory.id}
                          className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={formData.subcategoryIds.includes(subcategory.id)}
                            onChange={() => handleSubcategoryToggle(subcategory.id)}
                            className="h-4 w-4 text-[#e41e26] focus:ring-[#e41e26] border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{subcategory.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.categoryId && filteredSubcategories.length === 0 && (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-md">
                    <p className="text-sm">No hay subcategorías disponibles para esta categoría.</p>
                  </div>
                )}

                {/* Atributos agrupados */}
                {attributesByGroup.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Atributos del Producto</h2>

                    {attributesByGroup.map(({ group, attributes: groupAttributes }) => (
                      <div key={group.id} className="border border-gray-200 rounded-md p-4">
                        <h3 className="font-medium text-gray-900 mb-3">{group.name}</h3>
                        <div className="space-y-3">
                          {groupAttributes.map((attribute) => (
                            <div key={attribute.id}>
                              <label
                                htmlFor={`attr-${attribute.id}`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                {attribute.name}
                              </label>
                              <input
                                type="text"
                                id={`attr-${attribute.id}`}
                                value={attributeValues.find((av) => av.attributeId === attribute.id)?.value || ""}
                                onChange={(e) => handleAttributeValueChange(attribute.id, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                                placeholder={`Valor para ${attribute.name}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Producto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
