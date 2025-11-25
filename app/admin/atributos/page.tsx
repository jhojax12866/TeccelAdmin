"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Loader2, AlertCircle, Search } from "lucide-react"
import AdminLayout from "@/components/admin/admin-layout"

const API_BASE_URL = "http://localhost:3001"

interface AttributeGroup {
  id: number
  name: string
  updatedAt: string
}

interface Attribute {
  id: number
  name: string
  order: number
  attributeGroupId: number
  attributeGroup?: AttributeGroup
  updatedAt: string
}

export default function AtributosPage() {
  const router = useRouter()

  const [groups, setGroups] = useState<AttributeGroup[]>([])
  const [isEditingGroup, setIsEditingGroup] = useState(false)
  const [currentGroup, setCurrentGroup] = useState<AttributeGroup | null>(null)
  const [groupFormData, setGroupFormData] = useState({ name: "" })
  const [searchGroupTerm, setSearchGroupTerm] = useState("")

  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [isEditingAttribute, setIsEditingAttribute] = useState(false)
  const [currentAttribute, setCurrentAttribute] = useState<Attribute | null>(null)
  const [attributeFormData, setAttributeFormData] = useState({ name: "", order: 0, attributeGroupId: 0 })
  const [searchAttributeTerm, setSearchAttributeTerm] = useState("")
  const [filterGroupId, setFilterGroupId] = useState<number>(0)

  // Estados generales
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    fetchGroups()
  }, [router])

  const fetchGroups = async () => {
    setIsLoading(true)
    setError("")

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      const response = await fetch(`${API_BASE_URL}/catalog/attributes/groups`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al cargar grupos de atributos: ${response.status}`)
      }

      const data: AttributeGroup[] = await response.json()
      setGroups(data)

      if (data.length > 0) {
        await fetchAllAttributes()
      }
    } catch (err: any) {
      console.error("Error al cargar grupos:", err)
      setError(`Error al cargar grupos de atributos: ${err.message}`)
      setGroups([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNewGroup = () => {
    setCurrentGroup(null)
    setGroupFormData({ name: "" })
    setIsEditingGroup(true)
    setError("")
  }

  const handleEditGroup = (group: AttributeGroup) => {
    setCurrentGroup(group)
    setGroupFormData({ name: group.name })
    setIsEditingGroup(true)
    setError("")
  }

  const handleDeleteGroup = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este grupo de atributos?")) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      const response = await fetch(`${API_BASE_URL}/catalog/attributes/groups/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al eliminar" }))
        throw new Error(errorData.message || `Error al eliminar grupo: ${response.status}`)
      }

      await fetchGroups()
    } catch (err: any) {
      console.error("Error al eliminar grupo:", err)
      setError(err.message || "Error al eliminar grupo de atributos")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!groupFormData.name.trim()) {
      setError("El nombre del grupo es obligatorio")
      setIsSubmitting(false)
      return
    }

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      if (currentGroup) {
        const response = await fetch(`${API_BASE_URL}/catalog/attributes/groups/${currentGroup.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name: groupFormData.name }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Error al actualizar" }))
          throw new Error(errorData.message || `Error al actualizar grupo: ${response.status}`)
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/catalog/attributes/groups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ name: groupFormData.name }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Error al crear" }))
          throw new Error(errorData.message || `Error al crear grupo: ${response.status}`)
        }
      }

      setIsEditingGroup(false)
      setCurrentGroup(null)
      setGroupFormData({ name: "" })
      await fetchGroups()
    } catch (err: any) {
      console.error("Error al guardar grupo:", err)
      setError(err.message || "Error al guardar grupo de atributos")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fetchAllAttributes = async () => {
    setError("")

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      const allAttributes: Attribute[] = []

      for (const group of groups) {
        const response = await fetch(`${API_BASE_URL}/catalog/attributes/by-group/${group.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (response.ok) {
          const data: Attribute[] = await response.json()
          allAttributes.push(...data)
        }
      }

      setAttributes(allAttributes)
    } catch (err: any) {
      console.error("Error al cargar atributos:", err)
      setError(`Error al cargar atributos: ${err.message}`)
      setAttributes([])
    }
  }

  const fetchAttributesByGroup = async (groupId: number) => {
    if (groupId === 0) {
      await fetchAllAttributes()
      return
    }

    setError("")

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      const response = await fetch(`${API_BASE_URL}/catalog/attributes/by-group/${groupId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al cargar atributos: ${response.status}`)
      }

      const data: Attribute[] = await response.json()
      setAttributes(data)
    } catch (err: any) {
      console.error("Error al cargar atributos:", err)
      setError(`Error al cargar atributos: ${err.message}`)
      setAttributes([])
    }
  }

  useEffect(() => {
    if (groups.length > 0) {
      fetchAttributesByGroup(filterGroupId)
    }
  }, [filterGroupId])

  const handleAddNewAttribute = () => {
    setCurrentAttribute(null)
    setAttributeFormData({ name: "", order: 0, attributeGroupId: groups[0]?.id || 0 })
    setIsEditingAttribute(true)
    setError("")
  }

  const handleEditAttribute = (attribute: Attribute) => {
    setCurrentAttribute(attribute)
    setAttributeFormData({
      name: attribute.name,
      order: attribute.order,
      attributeGroupId: attribute.attributeGroupId,
    })
    setIsEditingAttribute(true)
    setError("")
  }

  const handleDeleteAttribute = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este atributo?")) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      const response = await fetch(`${API_BASE_URL}/catalog/attributes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al eliminar" }))
        throw new Error(errorData.message || `Error al eliminar atributo: ${response.status}`)
      }

      await fetchAttributesByGroup(filterGroupId)
    } catch (err: any) {
      console.error("Error al eliminar atributo:", err)
      setError(err.message || "Error al eliminar atributo")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitAttribute = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!attributeFormData.name.trim()) {
      setError("El nombre del atributo es obligatorio")
      setIsSubmitting(false)
      return
    }

    if (attributeFormData.attributeGroupId === 0) {
      setError("Debes seleccionar un grupo de atributos")
      setIsSubmitting(false)
      return
    }

    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No se encontró el token de acceso")
      }

      if (currentAttribute) {
        const response = await fetch(`${API_BASE_URL}/catalog/attributes/${currentAttribute.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: attributeFormData.name,
            order: attributeFormData.order,
            attributeGroupId: attributeFormData.attributeGroupId,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Error al actualizar" }))
          throw new Error(errorData.message || `Error al actualizar atributo: ${response.status}`)
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/catalog/attributes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: attributeFormData.name,
            order: attributeFormData.order,
            attributeGroupId: attributeFormData.attributeGroupId,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Error al crear" }))
          throw new Error(errorData.message || `Error al crear atributo: ${response.status}`)
        }
      }

      setIsEditingAttribute(false)
      setCurrentAttribute(null)
      setAttributeFormData({ name: "", order: 0, attributeGroupId: groups[0]?.id || 0 })
      await fetchAttributesByGroup(filterGroupId)
    } catch (err: any) {
      console.error("Error al guardar atributo:", err)
      setError(err.message || "Error al guardar atributo")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredGroups = groups.filter((group) => group.name.toLowerCase().includes(searchGroupTerm.toLowerCase()))
  const filteredAttributes = attributes.filter((attr) =>
    attr.name.toLowerCase().includes(searchAttributeTerm.toLowerCase()),
  )

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl gap-2 px-4 py-2 font-bold">Grupos de Atributos</h1>
              <p className="text-muted-foreground gap-2 px-4 py-2">Crea primero los grupos para luego agregar atributos</p>
            </div>
            <button
              onClick={handleAddNewGroup}
              className="flex items-center gap-2 px-4 py-2 bg-[#e41e26] text-white rounded-lg hover:bg-[#c41820] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Grupo
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {isEditingGroup && (
            <div className="p-6 bg-white border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{currentGroup ? "Editar Grupo" : "Nuevo Grupo"}</h2>
              <form onSubmit={handleSubmitGroup} className="space-y-4">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    value={groupFormData.name}
                    onChange={(e) => setGroupFormData({ name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                    required
                  />
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
                      setIsEditingGroup(false)
                      setCurrentGroup(null)
                      setGroupFormData({ name: "" })
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
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar grupos..."
                  value={searchGroupTerm}
                  onChange={(e) => setSearchGroupTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#e41e26]" />
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchGroupTerm ? "No se encontraron grupos con ese término de búsqueda" : "No hay grupos registrados"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">ID</th>
                      <th className="text-left p-3 font-semibold">Nombre</th>
                      <th className="text-right p-3 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroups.map((group) => (
                      <tr key={group.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{group.id}</td>
                        <td className="p-3">{group.name}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditGroup(group)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGroup(group.id)}
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

        <div className="space-y-6 border-t pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gap-2 px-4 py-2 ">Atributos</h1>
              <p className="text-muted-foreground gap-2 px-4 py-2">Gestiona los atributos de cada grupo</p>
            </div>
            <button
              onClick={handleAddNewAttribute}
              disabled={groups.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-[#e41e26] text-white rounded-lg hover:bg-[#c41820] transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Nuevo Atributo
            </button>
          </div>

          {groups.length === 0 && (
            <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <AlertCircle className="w-5 h-5" />
              <span>Debes crear al menos un grupo de atributos antes de crear atributos</span>
            </div>
          )}

          {isEditingAttribute && (
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{currentAttribute ? "Editar Atributo" : "Nuevo Atributo"}</h2>
              <form onSubmit={handleSubmitAttribute} className="space-y-4">
                <div>
                  <label htmlFor="attributeGroupId" className="block text-sm font-medium mb-2">
                    Grupo de Atributos
                  </label>
                  <select
                    id="attributeGroupId"
                    value={attributeFormData.attributeGroupId}
                    onChange={(e) =>
                      setAttributeFormData({ ...attributeFormData, attributeGroupId: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                    required
                  >
                    <option value={0}>Seleccionar grupo</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="attributeName" className="block text-sm font-medium mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="attributeName"
                    value={attributeFormData.name}
                    onChange={(e) => setAttributeFormData({ ...attributeFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="attributeOrder" className="block text-sm font-medium mb-2">
                    Orden
                  </label>
                  <input
                    type="number"
                    id="attributeOrder"
                    value={attributeFormData.order}
                    onChange={(e) => setAttributeFormData({ ...attributeFormData, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                    required
                  />
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
                      setIsEditingAttribute(false)
                      setCurrentAttribute(null)
                      setAttributeFormData({ name: "", order: 0, attributeGroupId: groups[0]?.id || 0 })
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
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar atributos..."
                    value={searchAttributeTerm}
                    onChange={(e) => setSearchAttributeTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                  />
                </div>
              </div>
              <div className="w-64">
                <select
                  value={filterGroupId}
                  onChange={(e) => setFilterGroupId(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e41e26]"
                >
                  <option value={0}>Todos los grupos</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#e41e26]" />
              </div>
            ) : filteredAttributes.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {searchAttributeTerm
                  ? "No se encontraron atributos con ese término de búsqueda"
                  : "No hay atributos registrados"}
              </div>
            ) : (
              <div className="overflow-x-auto ">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">ID</th>
                      <th className="text-left p-3 font-semibold">Nombre</th>
                      <th className="text-left p-3 font-semibold">Grupo</th>
                      <th className="text-left p-3 font-semibold">Orden</th>
                      <th className="text-right p-3 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttributes.map((attribute) => (
                      <tr key={attribute.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{attribute.id}</td>
                        <td className="p-3">{attribute.name}</td>
                        <td className="p-3">{attribute.attributeGroup?.name || "-"}</td>
                        <td className="p-3">{attribute.order}</td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditAttribute(attribute)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAttribute(attribute.id)}
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
      </div>
    </AdminLayout>
  )
}
