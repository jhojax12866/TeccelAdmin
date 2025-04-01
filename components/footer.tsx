"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-100 py-6 relative overflow-hidden">
      {/* Accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-[#e41e26] to-red-500"></div>

      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-red-100 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-red-50 opacity-50"></div>

      <div className="container mx-auto px-4">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-center transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0 translate-y-4"}`}
        >
          {/* Logo and company info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <div className="w-7 h-7 bg-[#e41e26] rounded-md flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h3 className="text-gray-800 font-bold">TECCEL MOCOA</h3>
            </div>
            <p className="text-gray-500 text-xs text-center md:text-left">
              La mejor tecnología con garantía y servicio excepcional
            </p>
            <div className="flex space-x-3 mt-3">
              <Link
                href="https://www.facebook.com/teccelmocoap/"
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[#e41e26] hover:text-white text-[#e41e26] flex items-center justify-center transition-colors duration-300"
              >
                <Facebook size={14} />
              </Link>
              <Link
                href="https://www.instagram.com/teccelmocoa/"
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[#e41e26] hover:text-white text-[#e41e26] flex items-center justify-center transition-colors duration-300"
              >
                <Instagram size={14} />
              </Link>
              <Link
                href="https://www.facebook.com/teccelmocoap/"
                className="w-6 h-6 rounded-full bg-gray-100 hover:bg-[#e41e26] hover:text-white text-[#e41e26] flex items-center justify-center transition-colors duration-300"
              >
                <Facebook size={14} />
              </Link>
            </div>
          </div>

          {/* Contact and address */}
          <div className="flex flex-col space-y-1 items-center md:items-start">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-[#e41e26] mr-2" />
              <p className="text-gray-600 text-xs"> Cra 7 # 8 - 25 Teccel Mocoa Barrio Centro Mocoa Putumayo</p>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-[#e41e26] mr-2" />
              <p className="text-gray-600 text-xs">+57 322 900 4323</p>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-[#e41e26] mr-2" />
              <p className="text-gray-600 text-xs">teccelmocoa@gmail.com</p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex justify-center md:justify-end space-x-4 text-xs">
            <div className="space-y-1">
              <Link href="./" className="block text-gray-600 hover:text-[#e41e26]">
                Inicio
              </Link>
              <Link href="./" className="block text-gray-600 hover:text-[#e41e26]">
                Productos
              </Link>
              <Link href="#" className="block text-gray-600 hover:text-[#e41e26]">
                Servicios
              </Link>
            </div>
            <div className="space-y-1">
              <Link href="./nosotros" className="block text-gray-600 hover:text-[#e41e26]">
                Nosotros
              </Link>
              <Link href="./contacto" className="block text-gray-600 hover:text-[#e41e26]">
                Contacto
              </Link>
              <Link href="#" className="block text-gray-600 hover:text-[#e41e26]">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          className={`border-t border-gray-100 mt-4 pt-4 flex flex-col md:flex-row justify-between items-center text-xs transition-all duration-700 delay-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-gray-500">© {currentYear} TECCEL MOCOA. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
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

