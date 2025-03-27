"use client"

import { ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import BrandCarousel from "./brand-carousel"

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-100 py-16 md:py-24">
      {/* Decorative elements */}
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#e41e26]/5"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e41e26]/5"></div>
      <div className="absolute left-1/4 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-[#e41e26]/10"></div>

      {/* Animated circles */}
      <div className="absolute right-1/4 top-1/3 h-4 w-4 rounded-full bg-[#e41e26]/20 animate-ping"></div>
      <div className="absolute bottom-1/4 left-1/3 h-3 w-3 rounded-full bg-[#e41e26]/30 animate-ping animation-delay-700"></div>

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div
            className={`space-y-8 transition-all duration-1000 ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl lg:text-7xl">BIENVENIDO</h1>

            <p className="text-lg text-gray-600 max-w-md">
              Conoce los productos que <span className="text-[#e41e26] font-medium">TECCEL MOCOA</span> tiene para ti,
              con las mejores marcas y tecnología del mercado.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="group relative overflow-hidden bg-[#e41e26] hover:bg-[#c41a21]">
                <span className="relative z-10">COMPRAR AHORA</span>
                <span className="absolute inset-0 -translate-x-full bg-[#c41a21] transition-transform group-hover:translate-x-0"></span>
              </Button>

              <Button variant="outline" className="group border-[#e41e26] text-[#e41e26] hover:bg-[#e41e26]/10">
                DETALLES
                <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-[#e41e26]">+1,000</span> clientes satisfechos
              </p>
            </div>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <div className="relative mx-auto">
              {/* Simple glow effect behind the carousel */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#e41e26]/20 to-transparent blur-3xl"></div>

              {/* Brand logo carousel */}
              <div className="relative z-10 flex items-center justify-center">
                <BrandCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

