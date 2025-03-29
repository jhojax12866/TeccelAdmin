"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import ProductsCarousel from "./product-carousel"


export default function ProductsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("products-section")
      if (!element) return

      const position = element.getBoundingClientRect()

      // If the element is in the viewport
      if (position.top < window.innerHeight - 100) {
        setIsVisible(true)
      }
    }

    // Check on initial load
    handleScroll()

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll)

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="products-section" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div
          className={`mb-12 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">Nuestros Productos</h2>
          <div className="mx-auto mb-6 h-1 w-20 bg-[#e41e26]"></div>
          <p className="mx-auto max-w-2xl text-gray-600">
            Descubre nuestra selección de smartphones de las mejores marcas con la última tecnología y al mejor precio.
          </p>
        </div>

        <div className="mb-12">
          <ProductsCarousel />
        </div>

        <div
          className={`text-center transition-all duration-700 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <Link href="/productos">
            <Button variant="outline" className="group border-[#e41e26] text-[#e41e26] hover:bg-[#e41e26]/10">
              Ver todos los productos
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

