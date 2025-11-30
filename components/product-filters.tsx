"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { Category } from "@/lib/api/types" // Asegúrate de tener este tipo o CategoryTree

// Interfaz para el árbol de categorías (si no la tienes exportada)
interface CategoryTree {
  id: number
  name: string
  subcategories: { id: number; name: string }[]
}

interface ProductFiltersProps {
  categories: CategoryTree[] // Recibimos el árbol de categorías en lugar de productos
}

export default function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // --- LÓGICA DE PRECIO ---
  // Obtenemos los valores de la URL o ponemos defaults
  const initialMinPrice = Number(searchParams.get("minPrice")) || 0
  const initialMaxPrice = Number(searchParams.get("maxPrice")) || 5000000 // 5 Millones como tope visual

  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice])

  // --- LÓGICA DE SUBCATEGORÍAS ---
  // Obtenemos las subcategorías seleccionadas de la URL (ej: ?subcategoryId=1,2)
  const currentSubcategories = searchParams.get("subcategoryId")?.split(",").map(Number) || []
  const [selectedSubcategories, setSelectedSubcategories] = useState<number[]>(currentSubcategories)

  // Manejador del Slider
  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  // Manejador de Checkbox de Subcategorías
  const toggleSubcategory = (subId: number) => {
    if (selectedSubcategories.includes(subId)) {
      setSelectedSubcategories(selectedSubcategories.filter((id) => id !== subId))
    } else {
      setSelectedSubcategories([...selectedSubcategories, subId])
    }
  }

  // APLICAR FILTROS (Actualizar URL)
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // 1. Precio
    // Solo seteamos si son diferentes a los defaults para no ensuciar la URL
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    // 2. Subcategorías
    if (selectedSubcategories.length > 0) {
      params.set("subcategoryId", selectedSubcategories.join(","))
    } else {
      params.delete("subcategoryId")
    }

    // Resetear a página 1 siempre que se filtra
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Filtros</h3>

      {/* FILTRO DE PRECIO */}
      <div className="mb-8">
        <h4 className="mb-3 font-medium text-sm text-gray-700">Rango de Precio</h4>
        <div className="px-2">
          <Slider
            defaultValue={[initialMinPrice, initialMaxPrice]}
            min={0}
            max={5000000} // Ajusta esto al precio máximo real de tu tienda
            step={50000}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>${new Intl.NumberFormat("es-CO").format(priceRange[0])}</span>
            <span>${new Intl.NumberFormat("es-CO").format(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* FILTRO POR CATEGORÍAS Y SUBCATEGORÍAS */}
      <div className="mb-6 space-y-6">
        {categories.map((category) => (
          <div key={category.id}>
            <h4 className="mb-2 font-bold text-gray-800 border-b pb-1">{category.name}</h4>
            
            <div className="space-y-2 pl-1">
              {category.subcategories && category.subcategories.length > 0 ? (
                category.subcategories.map((sub) => (
                  <div key={sub.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`sub-${sub.id}`}
                      checked={selectedSubcategories.includes(sub.id)}
                      onChange={() => toggleSubcategory(sub.id)}
                      className="w-4 h-4 mr-2 accent-[#e41e26] rounded border-gray-300"
                    />
                    <label htmlFor={`sub-${sub.id}`} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                      {sub.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">Sin subcategorías</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button 
        className="w-full py-2.5 text-white bg-[#e41e26] rounded-md hover:bg-[#c41a21] transition-colors font-medium text-sm" 
        onClick={applyFilters}
      >
        Aplicar Filtros
      </button>
    </div>
  )
}