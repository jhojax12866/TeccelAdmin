"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

type CollectionProps = {
  title: string
  image: string
  itemCount: number
  href: string
}

const Collection = ({ title, image, itemCount, href }: CollectionProps) => {
  return (
    <Link href={href} className="block">
      <motion.div
        className="overflow-hidden bg-white rounded-lg shadow-md border border-gray-100"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="relative h-48 overflow-hidden bg-[#f8f8f8]">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain p-4 transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4 text-center bg-white">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-[#e41e26]">{itemCount} items</p>
        </div>
      </motion.div>
    </Link>
  )
}

export default function Collections() {
  const collections = [
    {
      title: "Celulares",
      image: "/icons/celulares.png",
      itemCount: 18,
      href: "/productos/celulares",
    },
    {
      title: "Accesorios",
      image: "/icons/accesorios.png",
      itemCount: 12,
      href: "/productos/accesorios",
    },
    {
      title: "Otros",
      image: "/icons/otro.png",
      itemCount: 8,
      href: "/productos/otros",
    },
  ]

  return (
    <section className="py-16 bg-white relative">
     


      <div className="container px-4 mx-auto relative z-10">
        <h2 className="mb-12 text-3xl font-bold text-center">Collections</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Collection
              key={collection.title}
              title={collection.title}
              image={collection.image}
              itemCount={collection.itemCount}
              href={collection.href}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

