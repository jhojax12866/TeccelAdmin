"use client"

import { MapPin, Clock, Phone, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

export default function StoreLocation() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("store-location")
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
    <section id="store-location" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div
            className={`relative rounded-lg overflow-hidden transition-all duration-1000 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="aspect-video relative">
              <Image
                src="/placeholder.svg?height=400&width=600&text=Tienda+TECCEL+MOCOA"
                alt="Tienda TECCEL MOCOA"
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Overlay with store hours */}
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md">
              <div className="flex items-center gap-2 text-[#e41e26]">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Horario de Atención</span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-700">
                <div>Lunes - Viernes: 8:00 AM - 6:00 PM</div>
                <div>Sábados: 9:00 AM - 1:00 PM</div>
              </div>
            </div>
          </div>

          <div
            className={`space-y-6 transition-all duration-1000 delay-300 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Visita Nuestra Tienda</h2>
              <div className="w-20 h-1 bg-[#e41e26]"></div>
            </div>

            <p className="text-lg text-gray-600">
              En <span className="text-[#e41e26] font-medium">TECCEL MOCOA</span> contamos con un espacio moderno y
              acogedor donde podrás conocer todos nuestros productos y recibir asesoría personalizada de nuestros
              expertos.
            </p>

            <p className="text-gray-600">
              Nuestra tienda está equipada con la última tecnología para ofrecerte una experiencia de compra única.
              Además, contamos con un taller de servicio técnico especializado para reparaciones y mantenimiento de tus
              dispositivos.
            </p>

            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#e41e26] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Dirección</p>
                  <p className="text-sm text-gray-600">Calle Principal #123, Mocoa, Colombia</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-[#e41e26] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-sm text-gray-600">+57 123 456 7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

