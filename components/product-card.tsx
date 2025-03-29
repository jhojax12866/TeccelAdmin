"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "./ui/button"

interface ProductCardProps {
  product: {
    id: string
    brand: string
    model: string
    storage: string
    price: number
    image: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  // Format price with Colombian peso format
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price)

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/productos/${product.id}`} className="absolute inset-0 z-10">
        <span className="sr-only">
          Ver {product.brand} {product.model}
        </span>
      </Link>

      <div className="relative aspect-square overflow-hidden bg-gray-100 p-4">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={`${product.brand} ${product.model}`}
          fill
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="mb-1 text-xs font-medium text-[#e41e26]">{product.brand}</div>
        <h3 className="mb-1 text-sm font-semibold">{product.model}</h3>
        <div className="mb-3 text-xs text-gray-500">{product.storage}</div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold">{formattedPrice}</div>
          <Button
            size="sm"
            className="z-20 relative bg-[#e41e26] hover:bg-[#c41a21]"
            onClick={(e) => {
              e.preventDefault()
              // Add to cart functionality would go here
              alert(`${product.brand} ${product.model} añadido al carrito`)
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

