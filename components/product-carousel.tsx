"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import ProductCard from "./product-card"

interface Product {
  id: string
  brand: string
  model: string
  storage: string
  price: number
  image: string
  featured: boolean
}

export default function ProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  // Number of products to show per slide based on screen size
  const [itemsPerSlide, setItemsPerSlide] = useState(4)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerSlide(1)
      } else if (window.innerWidth < 768) {
        setItemsPerSlide(2)
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(3)
      } else {
        setItemsPerSlide(4)
      }
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/data/products.json")
        const data = await response.json()

        // Get featured products first, then add others until we have 8
        let featuredProducts = data.filter((product: Product) => product.featured)
        let otherProducts = data.filter((product: Product) => !product.featured)

        // Shuffle the arrays for variety
        featuredProducts = shuffleArray(featuredProducts)
        otherProducts = shuffleArray(otherProducts)

        // Combine to get 8 products total, prioritizing featured ones
        let selectedProducts = [...featuredProducts]

        if (selectedProducts.length < 8) {
          selectedProducts = [...selectedProducts, ...otherProducts.slice(0, 8 - selectedProducts.length)]
        } else {
          selectedProducts = selectedProducts.slice(0, 8)
        }

        setProducts(selectedProducts)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

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

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + itemsPerSlide
      return nextIndex >= products.length ? 0 : nextIndex
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - itemsPerSlide
      return nextIndex < 0 ? Math.max(0, products.length - itemsPerSlide) : nextIndex
    })
  }

  // Helper function to shuffle array
  const shuffleArray = (array: any[]) => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#e41e26] border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div
      className={`relative transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-full shrink-0 px-2" style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-[#e41e26] bg-white text-[#e41e26] hover:bg-[#e41e26] hover:text-white"
        onClick={prevSlide}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Anterior</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border-[#e41e26] bg-white text-[#e41e26] hover:bg-[#e41e26] hover:text-white"
        onClick={nextSlide}
        disabled={currentIndex >= products.length - itemsPerSlide}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Siguiente</span>
      </Button>
    </div>
  )
}

