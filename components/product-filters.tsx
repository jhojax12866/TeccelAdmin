"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Product } from "@/app/productos/category/page"

interface ProductFiltersProps {
  products: Product[]
}

export default function ProductFilters({ products }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Extraer marcas únicas de los productos
  const uniqueBrands = Array.from(new Set(products.map((product) => product.brand)))

  // Encontrar el precio mínimo y máximo
  const minPrice = Math.min(...products.map((product) => product.price), 0)
  const maxPrice = Math.max(...products.map((product) => product.price), 1000000)

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])

  // Obtener los filtros actuales de los searchParams
  const currentBrands = searchParams.get("brand")?.split(",") || []
  const [selectedBrands, setSelectedBrands] = useState<string[]>(currentBrands)

  const currentStorages = searchParams.get("storage")?.split(",") || []
  const [selectedStorages, setSelectedStorages] = useState<string[]>(currentStorages)

  // Extraer almacenamientos únicos
  const uniqueStorage = Array.from(new Set(products.map((product) => product.storage)))

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }

  const toggleStorage = (storage: string) => {
    if (selectedStorages.includes(storage)) {
      setSelectedStorages(selectedStorages.filter((s) => s !== storage))
    } else {
      setSelectedStorages([...selectedStorages, storage])
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedBrands.length > 0) {
      params.set("brand", selectedBrands.join(","))
    }

    if (selectedStorages.length > 0) {
      params.set("storage", selectedStorages.join(","))
    }

    if (priceRange[0] !== minPrice) {
      params.set("minPrice", priceRange[0].toString())
    }

    if (priceRange[1] !== maxPrice) {
      params.set("maxPrice", priceRange[1].toString())
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Filtros</h3>

      <div className="mb-6">
        <h4 className="mb-2 font-medium">Rango de Precio</h4>
        <div className="px-2">
          <Slider
            defaultValue={[minPrice, maxPrice]}
            min={minPrice}
            max={maxPrice}
            step={10000}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-6"
          />
          <div className="flex justify-between">
            <span>${(priceRange[0] / 1000).toFixed(3)}Cop</span>
            <span>${(priceRange[1] / 1000).toFixed(3)}Cop</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="mb-2 font-medium">Marcas</h4>
        <div className="space-y-2">
          {uniqueBrands.map((brand) => (
            <div key={brand} className="flex items-center">
              <input
                type="checkbox"
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 mr-2 accent-[#e41e26]"
              />
              <label htmlFor={`brand-${brand}`}>{brand}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="mb-2 font-medium">Almacenamiento</h4>
        <div className="space-y-2">
          {uniqueStorage.map((storage) => (
            <div key={storage} className="flex items-center">
              <input
                type="checkbox"
                id={`storage-${storage}`}
                checked={selectedStorages.includes(storage)}
                onChange={() => toggleStorage(storage)}
                className="w-4 h-4 mr-2 accent-[#e41e26]"
              />
              <label htmlFor={`storage-${storage}`}>{storage}</label>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-2 text-white bg-[#e41e26] rounded hover:bg-[#c41a21]" onClick={applyFilters}>
        Aplicar Filtros
      </button>
    </div>
  )
}

