"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, X, Loader2, AlertCircle, Upload, Camera, PlusCircle } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"

// URL base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

// Interfaces
interface Category {
  id: number
  name: string
  description?: string
}

interface Subcategory {
  id: number
  name: string
  description?: string
  category?: Category
}

interface SpecificationType {
  id: number
  name: string
  description?: string
}

// Interfaz para las especificaciones
interface SpecificationItem {
  typeId: string
  title: string
  value: string
}

export default function NuevoProductoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [specificationTypes, setSpecificationTypes] = useState<SpecificationType[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estado para el modal de nuevo tipo de especificación
  const [showNewTypeModal, setShowNewTypeModal] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")
  const [newTypeDescription, setNewTypeDescription] = useState("")
  const [isCreatingType, setIsCreatingType] = useState(false)

  // Estado para el formulario del producto
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    subcategoryId: "",
    storage: "",
    categoryId: "",
  })

  // Estado para la imagen
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Estado para las especificaciones
  const [specifications, setSpecifications] = useState<SpecificationItem[]>([{ typeId: "", title: "", value: "" }])

  // Filtrar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (formData.categoryId && subcategories.length > 0) {
      const categoryId = Number(formData.categoryId)
      const filtered = subcategories.filter((sub) => sub.category?.id === categoryId)
      setFilteredSubcategories(filtered)

      // Si la subcategoría actual no pertenece a la categoría seleccionada, resetearla
      if (formData.subcategoryId) {
        const currentSubCat = subcategories.find((s) => s.id === Number(formData.subcategoryId))
        if (currentSubCat && currentSubCat.category?.id !== categoryId) {
          setFormData((prev) => ({ ...prev, subcategoryId: "" }))
        }
      }
    } else {
      setFilteredSubcategories([])
    }
  }, [formData.categoryId, subcategories])

  // Cargar datos iniciales (categorías, subcategorías y tipos de especificaciones)
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoadingData(true)
      try {
        // Verificar si el usuario está autenticado
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
        if (!isLoggedIn) {
          router.push("/login")
          return
        }

        // Obtener token de acceso
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          throw new Error("No se encontró el token de acceso")
        }

        // Cargar categorías desde la API con paginación
        try {
          console.log("Cargando categorías...")
          const categoriesResponse = await fetch(`${API_BASE_URL}/category/with-pagination?page=1&perPage=50`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          if (categoriesResponse.ok) {
            const categoriesData = await categoriesResponse.json()
            console.log("Categorías cargadas:", categoriesData)

            if (categoriesData.rows && Array.isArray(categoriesData.rows)) {
              setCategories(categoriesData.rows)
            } else {
              console.warn("Formato de respuesta inesperado para categorías:", categoriesData)
              setCategories([])
            }
          } else {
            console.error("Error al cargar categorías:", categoriesResponse.status)
            setError("Error al cargar categorías. Por favor, intenta de nuevo.")
            setCategories([])
          }
        } catch (error) {
          console.error("Error al cargar categorías:", error)
          setError("Error de conexión al cargar categorías.")
          setCategories([])
        }

        // Cargar subcategorías desde la API con paginación
        try {
          console.log("Cargando subcategorías...")
          const subcategoriesResponse = await fetch(`${API_BASE_URL}/subcategory/with-pagination?page=1&perPage=100`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          if (subcategoriesResponse.ok) {
            const subcategoriesData = await subcategoriesResponse.json()
            console.log("Subcategorías cargadas:", subcategoriesData)

            if (subcategoriesData.rows && Array.isArray(subcategoriesData.rows)) {
              setSubcategories(subcategoriesData.rows)
            } else {
              console.warn("Formato de respuesta inesperado para subcategorías:", subcategoriesData)
              setSubcategories([])
            }
          } else {
            console.error("Error al cargar subcategorías:", subcategoriesResponse.status)
            setError("Error al cargar subcategorías. Por favor, intenta de nuevo.")
            setSubcategories([])
          }
        } catch (error) {
          console.error("Error al cargar subcategorías:", error)
          setError("Error de conexión al cargar subcategorías.")
          setSubcategories([])
        }

        // Cargar tipos de especificaciones desde la API
        try {
          const specTypesResponse = await fetch(`${API_BASE_URL}/specification-type`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })

          if (specTypesResponse.ok) {
            const specTypesData = await specTypesResponse.json()
            console.log("Tipos de especificaciones cargados:", specTypesData)
            setSpecificationTypes(Array.isArray(specTypesData) ? specTypesData : [])
          } else {
            console.error("Error al cargar tipos de especificaciones:", specTypesResponse.status)
            setError("Error al cargar tipos de especificaciones. Por favor, intenta de nuevo.")
            setSpecificationTypes([])
          }
        } catch (error) {
          console.error("Error al cargar tipos de especificaciones:", error)
          setError("Error de conexión al cargar tipos de especificaciones.")
          setSpecificationTypes([])
        }
      } catch (err: any) {
        console.error("Error al cargar datos iniciales:", err)
        setError(err.message || "Error al cargar datos iniciales")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchInitialData()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSpecificationChange = (index: number, field: keyof SpecificationItem, value: string) => {
    const newSpecifications = [...specifications]
    newSpecifications[index][field] = value
    setSpecifications(newSpecifications)
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { typeId: "", title: "", value: "" }])
  }

  const removeSpecification = (index: number) => {
    const newSpecifications = [...specifications]
    newSpecifications.splice(index, 1)
    setSpecifications(newSpecifications)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen es demasiado grande. El tamaño máximo es 5MB")
      return
    }

    setImageFile(file)

    // Crear URL para vista previa
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    // Limpiar error si existe
    if (error) setError("")
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Función para crear un nuevo tipo de especificación
  const createNewSpecificationType = async () => {
    if (!newTypeName.trim()) {
      alert("Por favor ingresa un nombre para el tipo de especificación")
      return
    }

    setIsCreatingType(true)

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      const typeData = {
        name: newTypeName.trim(),
        description: newTypeDescription.trim() || newTypeName.trim(),
      }

      const response = await fetch(`${API_BASE_URL}/specification-type`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(typeData),
      })

      if (!response.ok) {
        throw new Error(`Error al crear el tipo de especificación: ${response.status}`)
      }

      const newType = await response.json()

      // Añadir el nuevo tipo a la lista
      setSpecificationTypes((prev) => [...prev, newType])

      // Limpiar el formulario y cerrar el modal
      setNewTypeName("")
      setNewTypeDescription("")
      setShowNewTypeModal(false)

      // Mostrar mensaje de éxito
      alert("Tipo de especificación creado exitosamente")
    } catch (err: any) {
      console.error("Error al crear tipo de especificación:", err)
      alert(err.message || "Error al crear el tipo de especificación")
    } finally {
      setIsCreatingType(false)
    }
  }

  // Función para crear una nueva especificación
  const createSpecification = async (name: string, description: string) => {
  try {
    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      throw new Error("No se encontró el token de acceso")
    }

    const specData = {
      name: name,
      description: description,
    }

    console.log("Creando nueva especificación:", specData)

    const response = await fetch(`${API_BASE_URL}/specification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(specData),
    })

    if (!response.ok) {
      throw new Error(`Error al crear la especificación :c: ${response.status}`)
    }

    const newSpec = await response.json()
    return newSpec.id
  } catch (error) {
    console.error("Error al crear especificación:", error)
    throw error
  }
}


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validar campos requeridos
      if (!formData.name || !formData.price || !formData.subcategoryId) {
        throw new Error("Por favor completa todos los campos requeridos")
      }

      // Validar que el precio sea un número
      if (isNaN(Number(formData.price))) {
        throw new Error("El precio debe ser un número válido")
      }

      // Obtener token de acceso
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      // Crear nombre completo del producto
      const fullProductName = [formData.name, formData.storage].filter(Boolean).join(" ").trim()

      // Variable para almacenar la URL de la imagen
      let imageUrl = ""

      // Si hay una imagen seleccionada, subirla primero
      if (imageFile) {
        try {
          // Crear FormData para la imagen
          const imageFormData = new FormData()
          imageFormData.append("file", imageFile)

          // Intentar subir la imagen a la API
          const imageResponse = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: imageFormData,
          })

          if (!imageResponse.ok) {
            console.warn(`Error al subir la imagen: ${imageResponse.status}`)
            // Continuar sin imagen
          } else {
            const imageData = await imageResponse.json()
            imageUrl = imageData.url || imageData.path || ""
            console.log("Imagen subida exitosamente:", imageUrl)
          }
        } catch (imageError) {
          console.error("Error al subir la imagen:", imageError)
          // Continuar sin imagen si falla la carga
        }
      }

      // Crear objeto de producto según la estructura de la API
      const productData = {
        name: fullProductName,
        description: formData.description,
        price: Number(formData.price),
        image: imageUrl || "/placeholder.svg",
        subcategoryId: Number(formData.subcategoryId),
      }

      console.log("Enviando datos del producto:", productData)

      // Enviar producto a la API
      const productResponse = await fetch(`${API_BASE_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      })

      if (!productResponse.ok) {
        const errorData = await productResponse.json().catch(() => ({}))
        throw new Error(errorData.message || `Error al crear el producto: ${productResponse.status}`)
      }

      const productResult = await productResponse.json()
      const newProductId = productResult.id

      console.log("Producto creado con ID:", newProductId)

      // Filtrar especificaciones válidas
      const validSpecifications = specifications.filter((spec) => spec.typeId && spec.value && spec.title)

      // Crear especificaciones para el producto
      let specificationSuccess = true

      for (const spec of validSpecifications) {
        try {
          // 1. Crear la especificación
          const specificationId = await createSpecification(spec.title, spec.value)
          console.log(`Especificación creada con ID: ${specificationId}`)

          // 2. Crear la asociación entre producto y especificación
          const productSpecData = {
            productId: newProductId,
            specificationId: specificationId,
            titleId: 1, // Usar un valor fijo por ahora
            typeId: Number(spec.typeId),
          }

          console.log("Enviando datos de especificación:", productSpecData)

          const productSpecResponse = await fetch(`${API_BASE_URL}/product-specification`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(productSpecData),
          })

          if (!productSpecResponse.ok) {
            const errorText = await productSpecResponse.text()
            console.error("Error al asociar especificación al producto:", errorText)
            specificationSuccess = false
          } else {
            const result = await productSpecResponse.json()
            console.log("Especificación asociada correctamente al producto:", result)
          }
        } catch (specError: any) {
          console.error("Error al procesar especificación:", specError)
          specificationSuccess = false
        }
      }

      // Mostrar mensaje de éxito o advertencia
      if (validSpecifications.length > 0 && !specificationSuccess) {
        alert(
          "Producto creado, pero hubo problemas al guardar algunas especificaciones. Por favor, revisa los logs para más detalles.",
        )
      } else {
        alert("Producto creado exitosamente")
      }

      // Redirigir a la lista de productos
      router.push("/admin")
    } catch (err: any) {
      console.error("Error al crear el producto:", err)
      setError(err.message || "Error al crear el producto")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#e41e26]" />
            <p className="mt-2">Cargando datos...</p>
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
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información básica del producto */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Información del Producto</h2>

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
                  {categories.length === 0 && (
                    <p className="mt-1 text-sm text-amber-600">No hay categorías disponibles</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subcategoryId"
                    name="subcategoryId"
                    required
                    value={formData.subcategoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    disabled={!formData.categoryId}
                  >
                    <option value="">Selecciona una subcategoría</option>
                    {filteredSubcategories.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                  {formData.categoryId && filteredSubcategories.length === 0 && (
                    <p className="mt-1 text-sm text-amber-600">No hay subcategorías disponibles para esta categoría</p>
                  )}
                  {!formData.categoryId && (
                    <p className="mt-1 text-sm text-gray-500">Primero selecciona una categoría</p>
                  )}
                </div>

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
                    placeholder="Samsung Galaxy S23, iPhone 14, etc."
                  />
                </div>

                <div>
                  <label htmlFor="storage" className="block text-sm font-medium text-gray-700 mb-1">
                    Almacenamiento
                  </label>
                  <input
                    type="text"
                    id="storage"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    placeholder="128GB, 256GB, etc."
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
                    placeholder="599000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
                  <div className="mt-1 flex flex-col items-center">
                    {imagePreview ? (
                      <div className="relative w-full h-48 mb-4 border rounded-md overflow-hidden">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Vista previa"
                          fill
                          className="object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null)
                            setImageFile(null)
                            if (fileInputRef.current) fileInputRef.current.value = ""
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={triggerFileInput}
                        className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-[#e41e26] transition-colors"
                      >
                        <Camera className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Haz clic para seleccionar una imagen</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG o JPEG (máx. 5MB)</p>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {!imagePreview && (
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="mt-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e41e26]"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar imagen
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Especificaciones del producto */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-2">
                  <h2 className="text-lg font-semibold">Especificaciones</h2>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowNewTypeModal(true)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Nuevo tipo
                    </button>
                    <button
                      type="button"
                      onClick={addSpecification}
                      className="flex items-center text-sm text-[#e41e26] hover:text-[#c41a21]"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Añadir
                    </button>
                  </div>
                </div>

                {specifications.map((spec, index) => (
                  <div key={index} className="space-y-3 border-b pb-4 mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Especificación</label>
                        <select
                          value={spec.typeId}
                          onChange={(e) => handleSpecificationChange(index, "typeId", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                        >
                          <option value="">Selecciona un tipo</option>
                          {specificationTypes.length > 0 ? (
                            specificationTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              No hay tipos disponibles
                            </option>
                          )}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="ml-2 text-gray-400 hover:text-red-500 mt-6"
                        title="Eliminar especificación"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    {spec.typeId && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                          <input
                            type="text"
                            value={spec.title}
                            onChange={(e) => handleSpecificationChange(index, "title", e.target.value)}
                            placeholder="Ej: Tamaño de pantalla, Memoria RAM, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                            placeholder="Ej: 6.7 pulgadas, 8GB, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                          />
                        </div>
                      </div>
                    )}
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
                    placeholder="Describe el producto..."
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
                disabled={isLoading}
                className={`px-4 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21] ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Producto"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Modal para crear nuevo tipo de especificación */}
        {showNewTypeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Nuevo Tipo de Especificación</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="newTypeName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="newTypeName"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    placeholder="Ej: Pantalla, Procesador, RAM, etc."
                  />
                </div>

                <div>
                  <label htmlFor="newTypeDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="newTypeDescription"
                    value={newTypeDescription}
                    onChange={(e) => setNewTypeDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#e41e26] focus:border-[#e41e26]"
                    placeholder="Descripción opcional"
                    rows={3}
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewTypeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={createNewSpecificationType}
                  disabled={isCreatingType}
                  className={`px-4 py-2 bg-[#e41e26] text-white rounded-md hover:bg-[#c41a21] ${
                    isCreatingType ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isCreatingType ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                      Creando...
                    </>
                  ) : (
                    "Crear Tipo"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
