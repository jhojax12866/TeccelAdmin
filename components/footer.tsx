"use client"

import Link from "next/link"
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { useEffect, useState } from "react"

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const bodyHeight = document.body.scrollHeight

      // Adjust the threshold as needed (e.g., 200 pixels from the bottom)
      const threshold = 200

      if (bodyHeight - (scrollPosition + windowHeight) < threshold) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check in case the footer is already in view

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <footer className="bg-white border-t border-gray-100 py-8 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 items-start transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0 translate-y-4"}`}
        >
          {/* Logo and company info */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#e41e26] rounded-md flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h3 className="text-gray-800 font-bold">TECCEL MOCOA</h3>
            </div>
            <p className="text-gray-500 text-sm text-center md:text-left">
              La mejor tecnología con garantía y servicio excepcional
            </p>
            <div className="flex space-x-4 mt-2">
              <Link
                href="https://www.facebook.com/TeccelMocoacelulares"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#e41e26] hover:text-white text-[#e41e26] flex items-center justify-center transition-colors duration-300"
              >
                <Facebook size={16} />
              </Link>
              <Link
                href="https://www.instagram.com/teccelmocoa/"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#e41e26] hover:text-white text-[#e41e26] flex items-center justify-center transition-colors duration-300"
              >
                <Instagram size={16} />
              </Link>
              <Link
                href="#"
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#e41e26] hover:text-white text-[#e41e26] flex items-center justify-center transition-colors duration-300"
              >
                <Twitter size={16} />
              </Link>
            </div>
          </div>

          {/* Contact and address */}
          <div className="flex flex-col space-y-3 items-center md:items-start">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-[#e41e26] mr-2" />
              <p className="text-gray-600 text-sm">Cra 7 # 8 - 25 Teccel Mocoa Barrio Centro Mocoa Putumayo</p>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-[#e41e26] mr-2" />
              <p className="text-gray-600 text-sm">+57 322 900 4323</p>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-[#e41e26] mr-2" />
              <p className="text-gray-600 text-sm">teccelmocoa25@gmail.com</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex justify-center md:justify-end">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1">
              <Link href="./" className="text-gray-600 hover:text-[#e41e26] text-sm">
                Inicio
              </Link>
              <Link href="./nosotros" className="text-gray-600 hover:text-[#e41e26] text-sm">
                Nosotros
              </Link>
              <Link href="./productos/celulares" className="text-gray-600 hover:text-[#e41e26] text-sm">
                Productos
              </Link>
              <Link href="./contacto" className="text-gray-600 hover:text-[#e41e26] text-sm">
                Contacto
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#e41e26] text-sm">
                Servicios
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#e41e26] text-sm">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          className={`border-t border-gray-100 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-sm transition-all duration-700 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-gray-500">© {currentYear} TECCEL MOCOA. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <Link href="#" className="text-gray-500 hover:text-[#e41e26]">
              Términos
            </Link>
            <Link href="#" className="text-gray-500 hover:text-[#e41e26]">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
