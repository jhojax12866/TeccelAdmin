"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Save, Loader2, AlertCircle, Upload, Trash2, Edit2, Plus, X } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"
import { productService } from "@/lib/api/services/product.service"
import { attributeService } from "@/lib/api/services/attribute.service"
import type {
  Subcategory,
  AttributeGroup,
  UpdateProductRequest,
  ProductAttributeValue,
} from "@/lib/api/types"

interface CategoryTree {
  id: number
  name: string
  subcategories: Subcategory[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function EditarProductoPage() {
  const router = useRouter()
  const params = useParams()
  const productId = Number(params.id)

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  // --- DATOS MAESTROS ---
  const [categoryTree, setCategoryTree] = useState<CategoryTree[]>([])
  const [currentSubcategories, setCurrentSubcategories] = useState<Subcategory[]>([])
  
  // GESTIÓN DE GRUPOS INTELIGENTE
  const [allMasterGroups, setAllMasterGroups] = useState<AttributeGroup[]>([]) // Todos los de la BD
  const [visibleGroupIds, setVisibleGroupIds] = useState<number[]>([]) // Solo los que usa este producto

  // --- DATOS DEL PRODUCTO ---
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "", description: "", code: "", price: "", priceDiscount: "", stock: "", isActive: true, categoryId: "", subcategoryIds: [] as number[],
  })

  const [attributeValues, setAttributeValues] = useState<ProductAttributeValue[]>([])

  // --- MODALES ---
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [isCreatorOpen, setIsCreatorOpen] = useState(false)
  const [isAttrModalOpen, setIsAttrModalOpen] = useState(false)
  
  const [newGroupName, setNewGroupName] = useState("") 
  const [newAttributeName, setNewAttributeName] = useState("")
  const [targetGroupId, setTargetGroupId] = useState<number>(0)
  const [editingGroup, setEditingGroup] = useState<{id: number | null, name: string}>({ id: null, name: "" }) 
  
  const [isModalLoading, setIsModalLoading] = useState(false)

  // 1. CARGA INICIAL (Master Data + Producto)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)
      setError("")

      try {
        if (!productId) throw new Error("ID inválido")

        const [treeRes, groupsRes, product] = await Promise.all([
          fetch(`${API_BASE_URL}/catalog/categories/tree`).then(res => res.json()),
          attributeService.getAllAttributeGroups(),
          productService.getProductById(productId)
        ])

        setCategoryTree(treeRes)
        setAllMasterGroups(groupsRes)

        // --- MAPEO INTELIGENTE DEL PRODUCTO ---

        // 1. Detectar Categoría
        let detectedCategoryId = ""
        const detectedSubIds: number[] = []

        if (product.productSubcategories && product.productSubcategories.length > 0) {
            product.productSubcategories.forEach((relation: any) => {
                detectedSubIds.push(relation.subcategoryId)
            })
            const parentCat = treeRes.find((cat: CategoryTree) => 
                cat.subcategories.some(sub => sub.id === detectedSubIds[0])
            )
            if (parentCat) {
                detectedCategoryId = String(parentCat.id)
                setCurrentSubcategories(parentCat.subcategories)
            }
        }

        // 2. Llenar Formulario Base
        setFormData({
            name: product.name,
            description: product.description || "",
            code: product.code,
            price: String(product.price),
            priceDiscount: (product as any).pricediscount ? String((product as any).pricediscount) : "",
            stock: String(product.stock),
            isActive: product.isActive,
            categoryId: detectedCategoryId,
            subcategoryIds: detectedSubIds
        })

        // 3. Imágenes
        if (product.images && product.images.length > 0) {
            const urls = product.images.map((img: any) => img.imageUrl)
            setImagePreviews(urls)
        }

        // 4. ATRIBUTOS Y GRUPOS VISIBLES
        if ((product as any).attributeValues) {
            const rawAttrs = (product as any).attributeValues
            
            // A. Mapear valores para los inputs
            const mappedAttrs = rawAttrs.map((av: any) => ({
                attributeId: av.attributeId,
                value: av.value
            }))
            setAttributeValues(mappedAttrs)

            // B. DETECTAR QUÉ GRUPOS ESTÁ USANDO ESTE PRODUCTO
            const usedGroupIds = new Set<number>()
            
            rawAttrs.forEach((av: any) => {
                if (av.attribute && av.attribute.attributeGroupId) {
                    usedGroupIds.add(av.attribute.attributeGroupId)
                }
            })
            
            setVisibleGroupIds(Array.from(usedGroupIds))
        }

      } catch (err: any) {
        console.error("Error cargando producto:", err)
        setError(err.message || "Error al cargar los datos")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [productId])

  // Lógica de cambio de Categoría
  useEffect(() => {
    if (!isLoadingData && formData.categoryId) {
        const catId = Number(formData.categoryId)
        const selectedCategory = categoryTree.find(c => c.id === catId)
        if (selectedCategory) setCurrentSubcategories(selectedCategory.subcategories)
        else setCurrentSubcategories([])
    }
  }, [formData.categoryId, categoryTree, isLoadingData])

  // --- FUNCIONES DE GESTIÓN INLINE ---

  const refreshMasterGroups = async () => {
    try {
      const groups = await attributeService.getAllAttributeGroups()
      setAllMasterGroups(groups)
    } catch (e) { console.error(e) }
  }

  // --- MODAL: AGREGAR GRUPO EXISTENTE ---
  const handleAddExistingGroup = (groupId: number) => {
    if (!visibleGroupIds.includes(groupId)) {
      setVisibleGroupIds([...visibleGroupIds, groupId])
    }
    setIsSelectorOpen(false)
  }

  const handleRemoveGroupFromView = (groupId: number) => {
    // Solo lo quitamos de la vista, no borramos datos de la BD
    setVisibleGroupIds(visibleGroupIds.filter(id => id !== groupId))
  }

  // --- MODAL: CREAR GRUPO ---
  const handleCreateNewGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    setIsModalLoading(true)
    try {
      const res = await attributeService.createAttributeGroup({ name: newGroupName })
      await refreshMasterGroups()
      setVisibleGroupIds(prev => [...prev, res.id])
      setIsCreatorOpen(false)
      setNewGroupName("")
    } catch (err) {
      alert("Error al crear grupo")
    } finally {
      setIsModalLoading(false)
    }
  }

  // --- MODAL: EDITAR NOMBRE GRUPO ---
  const openEditGroupModal = (id: number, name: string) => {
    // Usamos un prompt simple para editar nombre rápido
    const newName = prompt("Nuevo nombre para el grupo:", name)
    if(newName && newName !== name) {
        handleUpdateGroupName(id, newName)
    }
  }

  const handleUpdateGroupName = async (id: number, name: string) => {
      try {
          await attributeService.updateAttributeGroup(id, { name })
          await refreshMasterGroups()
      } catch (e) { alert("Error al renombrar") }
  }

  // --- MODAL: AGREGAR ATRIBUTO ---
  const openAddAttributeModal = (groupId: number) => {
    setTargetGroupId(groupId)
    setNewAttributeName("")
    setIsAttrModalOpen(true)
  }

  const handleSaveAttribute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAttributeName.trim()) return
    setIsModalLoading(true)
    try {
      await attributeService.createAttribute({ 
        name: newAttributeName, 
        attributeGroupId: targetGroupId,
        order: 0 
      })
      await refreshMasterGroups()
      setIsAttrModalOpen(false)
      setNewAttributeName("")
    } catch (err) {
      alert("Error al crear atributo")
    } finally {
      setIsModalLoading(false)
    }
  }

  // --- MANEJADORES FORMULARIO ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
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
      // Si borran el texto, lo quitamos del array temporal
      if (value === "") return prev.filter((av) => av.attributeId !== attributeId)
      
      if (existing) return prev.map((av) => (av.attributeId === attributeId ? { ...av, value } : av))
      return [...prev, { attributeId, value }]
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
        if (newPreviews.length === files.length) setImagePreviews((prev) => [...prev, ...newPreviews])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // --- SUBMIT (UPDATE) CON FILTRADO DE GRUPOS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      if (!formData.name || !formData.price) throw new Error("Faltan campos requeridos")

      // === FILTRADO MÁGICO ===
      // Solo enviamos los atributos que pertenecen a grupos VISIBLES.
      // Esto asegura que si diste a la "X" en un grupo, sus datos NO se envíen.
      const filteredAttributeValues = attributeValues.filter((av) => {
        const parentGroup = allMasterGroups.find(group => 
            group.attributes && group.attributes.some(attr => attr.id === av.attributeId)
        )
        return parentGroup && visibleGroupIds.includes(parentGroup.id)
      })

      const updateData: UpdateProductRequest = {
        name: formData.name,
        description: formData.description,
        code: formData.code,
        price: Number(formData.price),
        priceDiscount: formData.priceDiscount ? Number(formData.priceDiscount) : undefined,
        stock: Number(formData.stock),
        isActive: formData.isActive,
        images: imagePreviews,
        subcategoryIds: formData.subcategoryIds,
        attributeValues: filteredAttributeValues, // Usamos la lista filtrada
      }

      await productService.updateProduct(productId, updateData)
      setSuccess("Producto actualizado correctamente")
      setTimeout(() => router.push("/admin"), 1500)

    } catch (err: any) {
      setError(err.message || "Error al actualizar")
    } finally {
      setIsLoading(false)
    }
  }

  // FILTRO VISUAL PARA RENDERIZAR
  const visibleGroups = allMasterGroups.filter(g => visibleGroupIds.includes(g.id))

  if (isLoadingData) return <AdminLayout><div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#e41e26]"/></div></AdminLayout>

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900"><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-2xl font-bold">Editar Producto #{productId}</h1>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded flex gap-2"><AlertCircle className="h-5 w-5"/>{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 text-green-600 border border-green-200 rounded flex gap-2"><AlertCircle className="h-5 w-5"/>{success}</div>}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* IZQUIERDA: Básico */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Información Básica</h2>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border rounded p-2 focus:ring-[#e41e26]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Código *</label>
                  <input type="text" name="code" required value={formData.code} onChange={handleChange} className="w-full border rounded p-2 focus:ring-[#e41e26]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Precio *</label>
                        <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full border rounded p-2 focus:ring-[#e41e26]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Descuento</label>
                        <input type="number" name="priceDiscount" value={formData.priceDiscount} onChange={handleChange} className="w-full border rounded p-2 focus:ring-[#e41e26]" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full border rounded p-2 focus:ring-[#e41e26]" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Descripción</label>
                    <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full border rounded p-2 focus:ring-[#e41e26]" />
                </div>
                <div className="flex items-center gap-2">
                    <input type="checkbox" name="isActive" id="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 text-[#e41e26]" />
                    <label htmlFor="isActive" className="text-sm">Activo</label>
                </div>

                {/* Imágenes */}
                <div>
                    <label className="block text-sm font-medium mb-2">Imágenes</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center w-full text-gray-600">
                            <Upload className="h-8 w-8 mb-2" />
                            <span className="text-sm">Añadir imágenes</span>
                        </button>
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {imagePreviews.map((src, i) => (
                                    <div key={i} className="relative group h-20 w-full">
                                        <Image src={src} alt="Preview" fill className="object-cover rounded" unoptimized />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
              </div>

              {/* DERECHA: Configuración */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">Configuración</h2>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoría *</label>
                  <select name="categoryId" required value={formData.categoryId} onChange={handleChange} className="w-full border rounded p-2 focus:ring-[#e41e26]">
                    <option value="">Selecciona</option>
                    {categoryTree.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                {currentSubcategories.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded border">
                    <label className="block text-sm font-medium mb-2">Subcategorías</label>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {currentSubcategories.map(sub => (
                        <label key={sub.id} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={formData.subcategoryIds.includes(sub.id)} onChange={() => handleSubcategoryToggle(sub.id)} className="text-[#e41e26]" />
                          <span className="text-sm">{sub.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- GRILLA DE TARJETAS (Editables y Dinámicas) --- */}
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold">Especificaciones</h2>
                    <button type="button" onClick={() => setIsSelectorOpen(true)} className="text-xs flex items-center bg-gray-900 text-white px-3 py-1.5 rounded hover:bg-black transition-colors">
                      <Plus className="h-3 w-3 mr-1" /> Agregar Grupo
                    </button>
                  </div>

                  {visibleGroups.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {visibleGroups.map((group) => (
                        <div key={group.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 relative group/card">
                          
                          <div className="border-b border-gray-100 pb-2 mb-3 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">{group.name}</h3>
                            <div className="flex gap-2">
                                <button type="button" onClick={() => openEditGroupModal(group.id, group.name)} className="text-blue-600 hover:text-blue-800" title="Editar Nombre"><Edit2 className="h-4 w-4"/></button>
                                <button type="button" onClick={() => openAddAttributeModal(group.id)} className="text-green-600 hover:text-green-800" title="Agregar Campo"><Plus className="h-4 w-4"/></button>
                                <button type="button" onClick={() => handleRemoveGroupFromView(group.id)} className="text-gray-400 hover:text-red-500" title="Quitar de la vista"><X className="h-4 w-4"/></button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {group.attributes && group.attributes.length > 0 ? (
                              group.attributes.map((attr) => (
                                <div key={attr.id} className="flex justify-between items-center gap-2">
                                  <label className="text-xs font-medium text-gray-500 w-1/3 truncate" title={attr.name}>{attr.name}</label>
                                  <input 
                                    type="text"
                                    className="w-2/3 border-b border-gray-300 focus:border-[#e41e26] focus:ring-0 px-2 py-1 text-sm text-right outline-none bg-transparent placeholder-gray-300"
                                    placeholder="-"
                                    value={attributeValues.find(av => av.attributeId === attr.id)?.value || ""}
                                    onChange={(e) => handleAttributeValueChange(attr.id, e.target.value)}
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-2">
                                <p className="text-xs text-gray-400 italic mb-1">Sin atributos.</p>
                                <button type="button" onClick={() => openAddAttributeModal(group.id)} className="text-xs text-[#e41e26] hover:underline">+ Agregar Campo</button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">Este producto no tiene especificaciones configuradas.</p>
                        <button type="button" onClick={() => setIsSelectorOpen(true)} className="text-sm text-[#e41e26] hover:underline font-medium">Agregar grupos</button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-4">
              <button type="button" onClick={() => router.back()} className="px-6 py-2 border rounded hover:bg-gray-50" disabled={isLoading}>Cancelar</button>
              <button type="submit" disabled={isLoading} className="px-6 py-2 bg-[#e41e26] text-white rounded hover:bg-[#c41a21] disabled:opacity-50 flex items-center gap-2">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Actualizar Producto
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- MODALES --- */}
      
      {isSelectorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Agregar Grupo</h3>
              <button onClick={() => setIsSelectorOpen(false)}><X className="h-5 w-5 text-gray-500"/></button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2 mb-4">
                {allMasterGroups.length === 0 && <p className="text-sm text-gray-500">No hay grupos creados.</p>}
                {allMasterGroups.map(group => {
                    const isAdded = visibleGroupIds.includes(group.id);
                    return (
                        <button key={group.id} type="button" disabled={isAdded} onClick={() => handleAddExistingGroup(group.id)} className={`w-full text-left p-3 rounded border flex justify-between items-center transition-colors ${isAdded ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'}`}>
                            <span>{group.name}</span>
                            {isAdded ? <span className="text-xs">Agregado</span> : <Plus className="h-4 w-4 text-[#e41e26]"/>}
                        </button>
                    )
                })}
            </div>
            <div className="border-t pt-4">
                <button type="button" onClick={() => { setIsSelectorOpen(false); setIsCreatorOpen(true); }} className="w-full py-2 border border-dashed border-gray-400 text-gray-600 rounded hover:bg-gray-50 text-sm font-medium">
                    + Crear un nuevo grupo
                </button>
            </div>
          </div>
        </div>
      )}

      {isCreatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">Crear Nuevo Grupo</h3>
            <form onSubmit={handleCreateNewGroup}>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input type="text" autoFocus className="w-full border rounded p-2 mb-4 focus:ring-[#e41e26]" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsCreatorOpen(false)} className="px-4 py-2 border rounded text-sm">Cancelar</button>
                    <button type="submit" disabled={isModalLoading} className="px-4 py-2 bg-[#e41e26] text-white rounded text-sm flex items-center">
                        {isModalLoading && <Loader2 className="h-3 w-3 animate-spin mr-2"/>} Crear
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      {isAttrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold mb-4">Nuevo Campo</h3>
            <form onSubmit={handleSaveAttribute}>
                <label className="block text-sm font-medium mb-1">Nombre del Campo</label>
                <input type="text" autoFocus className="w-full border rounded p-2 mb-4 focus:ring-[#e41e26]" value={newAttributeName} onChange={(e) => setNewAttributeName(e.target.value)} placeholder="Ej: Material" />
                <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setIsAttrModalOpen(false)} className="px-4 py-2 border rounded text-sm">Cancelar</button>
                    <button type="submit" disabled={isModalLoading} className="px-4 py-2 bg-gray-900 text-white rounded text-sm flex items-center">
                        {isModalLoading && <Loader2 className="h-3 w-3 animate-spin mr-2"/>} Agregar
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  )
}