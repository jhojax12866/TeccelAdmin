"use client"

import { useState } from "react"
import ProductCard from "@/components/product-card"
import { Grid, List } from "lucide-react"
import type { Product } from "@/app/productos/category/page"
import { useSearchParams } from "next/navigation"

type ViewMode = "grid" | "list"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "relevance")

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price
    if (sortBy === "price-high") return b.price - a.price
    if (sortBy === "name") return a.model.localeCompare(b.model)
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Views</span>
          <button
            className={`p-1 rounded ${viewMode === "grid" ? "bg-[#e41e26]/10 text-[#e41e26]" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid size={20} />
          </button>
          <button
            className={`p-1 rounded ${viewMode === "list" ? "bg-[#e41e26]/10 text-[#e41e26]" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort By</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 py-1 border rounded">
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {products.length > 0 ? (
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <h2 className="mb-2 text-xl font-semibold">No se encontraron productos</h2>
          <p className="text-gray-600">Intenta ajustar los filtros para ver más resultados.</p>
        </div>
      )}
    </div>
  )
}

