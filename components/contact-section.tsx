"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import IconLinks from "@/components/ui/icons";
import ContactForm from "@/components/contact-form";

export default function Section() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-100 py-16 md:py-24 w-full">
      {/* Blur llamativo */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[250px] w-[90%] mx-auto rounded-full bg-[#e41e26]/20 blur-3xl opacity-50 z-0"></div>

      <div className="container relative mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
          {/* Iconos de contacto y redes sociales */}
          <IconLinks className="w-full" />
          
          {/* Texto y botón a la derecha */}
          <div
            className={`space-y-8 transition-all duration-1000 text-center md:text-left w-full ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"}`}
          >
            <h2 className="text-5xl font-extrabold tracking-tight text-gray-900 md:text-6xl w-full">
              Contáctanos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto md:mx-0 w-full">
              ¿Tienes dudas o necesitas asesoría? En <span className="text-[#e41e26] font-medium">TECCEL MOCOA </span>
              estamos para ayudarte.
            </p>
            <div className="w-full flex items-center justify-center md:justify-start space-x-4">
              <Button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-[#e41e26] hover:bg-[#c41a21] px-8 py-4 text-lg font-bold rounded-xl shadow-lg transform transition hover:scale-105"
              >
                📩 Escríbenos Ahora
              </Button>
              <span className="text-lg font-medium text-gray-700">Envíanos un mensaje</span>
            </div>
          </div>
        </div>
      </div>

      <ContactForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
