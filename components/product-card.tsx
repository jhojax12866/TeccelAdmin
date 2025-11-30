"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"
// Asegúrate de que esta importación apunte a tu archivo de tipos actualizado (donde está ApiProductRaw o Product nuevo)
import type { Product } from "@/lib/api/types" 

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  // 1. Desestructuración adaptada al NUEVO formato
  const { id, name, code, price, priceDiscount, images } = product

  // 2. Lógica de Imagen: Tomar la primera o usar placeholder
  const mainImage = images && images.length > 0 
    ? images[0].imageUrl 
    : "/placeholder.svg"

  // 3. Lógica de Precio (Para no repetir código en el JSX)
  const PriceDisplay = () => (
    <div className="flex flex-col items-start">
      {priceDiscount ? (
        <>
          <span className="text-lg font-bold text-[#e41e26]">{formatPrice(priceDiscount)}</span>
          <span className="text-xs text-gray-400 line-through">{formatPrice(price)}</span>
        </>
      ) : (
        <span className="text-lg font-bold text-gray-900">{formatPrice(price)}</span>
      )}
    </div>
  )

  // VISTA LISTA
  if (viewMode === "list") {
    return (
      <motion.div
        className="flex overflow-hidden bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="relative w-1/3 h-40 bg-gray-50">
          <Image 
            src={mainImage} 
            alt={name} 
            fill 
            className="object-contain p-2" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="flex flex-col justify-between w-2/3 p-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
              {name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{code}</p>
          </div>
          <div className="flex items-end justify-between mt-4">
            <PriceDisplay />
            <Link
              href={`/producto/${id}`}
              className="px-4 py-2 text-sm text-white bg-[#e41e26] rounded hover:bg-[#c41a21] transition-colors"
            >
              Ver Detalles
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  // VISTA GRID (Por defecto)
  return (
    <motion.div
      className="overflow-hidden bg-white border rounded-lg shadow-sm group hover:shadow-md transition-all"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative h-48 p-4 bg-gray-50 overflow-hidden">
        <Image 
            src={mainImage} 
            alt={name} 
            fill 
            className="object-contain group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Badge de Descuento si aplica */}
        {priceDiscount && (
            <div className="absolute top-2 right-2 bg-red-100 text-[#e41e26] text-xs font-bold px-2 py-1 rounded">
                Oferta
            </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem]" title={name}>
          {name}
        </h3>
        <p className="text-xs text-gray-500 mt-1 mb-3">{code}</p>
        
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          <PriceDisplay />
          <Link
            href={`/producto/${id}`}
            className="px-3 py-1.5 text-xs font-medium text-white bg-[#e41e26] rounded hover:bg-[#c41a21] transition-colors"
          >
            Ver
          </Link>
        </div>
      </div>
    </motion.div>
  )
}