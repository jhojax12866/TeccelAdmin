"use client"

import { MapPin, Mail, Phone, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import ContactForm from "@/components/contact-form"

export default function ContactPageContent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div
              className={`text-center mb-12 transition-all duration-700 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
            >
              <h1 className="text-4xl font-bold mb-4">Contacto</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta o soporte técnico.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 space-y-8">
                <div
                  className={`bg-white p-6 rounded-lg shadow-sm border transition-all duration-700 delay-100 ${
                    isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-6">Información de Contacto</h2>

                  <div className="space-y-4">
                    <div
                      className={`flex items-start gap-3 transition-all duration-500 delay-200 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <MapPin className="h-5 w-5 text-[#e41e26] mt-0.5" />
                      <div>
                        <p className="font-medium">Dirección</p>
                        <p className="text-sm text-gray-600"> Cra 7 # 8 - 25 Teccel Mocoa Barrio Centro Mocoa Putumayo</p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start gap-3 transition-all duration-500 delay-300 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <Mail className="h-5 w-5 text-[#e41e26] mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-600">teccelmocoa25@gmail.com</p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start gap-3 transition-all duration-500 delay-400 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <Phone className="h-5 w-5 text-[#e41e26] mt-0.5" />
                      <div>
                        <p className="font-medium">Teléfono</p>
                        <p className="text-sm text-gray-600">+57 322 900 4323</p>
                      </div>
                    </div>

                    <div
                      className={`flex items-start gap-3 transition-all duration-500 delay-500 ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <Clock className="h-5 w-5 text-[#e41e26] mt-0.5" />
                      <div>
                        <p className="font-medium">Horario de Atención</p>
                        <p className="text-sm text-gray-600">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                        <p className="text-sm text-gray-600">Sábados: 9:00 AM - 1:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`bg-[#e41e26]/5 p-6 rounded-lg border border-[#e41e26]/10 transition-all duration-700 delay-300 ${
                    isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
                  }`}
                >
                  <h3 className="font-medium mb-2">Servicio Técnico</h3>
                  <p className="text-sm text-gray-600">
                    Para soporte técnico especializado, por favor llámanos directamente o visita nuestra tienda.
                  </p>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2">
                <div
                  className={`bg-white p-6 rounded-lg shadow-sm border transition-all duration-700 delay-200 ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  }`}
                >
                  <h2 className="text-xl font-semibold mb-6">Envíanos un mensaje</h2>
                  <div className={`transition-all duration-700 delay-400 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

