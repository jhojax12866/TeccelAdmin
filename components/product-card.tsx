"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { formatPrice } from "@/lib/utils"
import { Product } from "@/app/productos/category/page"
interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const { id, brand, model, storage, price, image } = product
  console.log("ProductCard", product)



  if (viewMode === "list") {
    return (
      <motion.div
        className="flex overflow-hidden bg-white border rounded-lg shadow-sm"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <div className="relative w-1/3 h-40">
          <Image src={image || "/placeholder.svg"} alt={`${brand} ${model}`} fill className="object-contain" />
        </div>
        <div className="flex flex-col justify-between w-2/3 p-4">
          <div>
            <h3 className="text-lg font-semibold">
              {brand} {model}
            </h3>
            <p className="text-sm text-gray-600">{storage}</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-bold text-red-500">{formatPrice(price)}</span>
            <Link
              href={`/producto/${id}`}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
            >
              Ver Detalles
            </Link>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="overflow-hidden bg-white border rounded-lg shadow-sm"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative h-48 p-4">
        <Image src={image || "/placeholder.svg"} alt={`${brand} ${model}`} fill className="object-contain" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">
          {brand} {model}
        </h3>
        <p className="text-sm text-gray-600">{storage}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-bold text-red-500">{formatPrice(price)}</span>
          <Link
            href={`/producto/${id}`}
            className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
          >
            Ver
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

