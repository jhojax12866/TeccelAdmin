"use client"

import { Building2, Target, Eye, Users } from "lucide-react"

export default function AboutUs() {
  return (
    <div className="relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#e41e26]/5"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e41e26]/5"></div>
      <div className="absolute left-1/4 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-[#e41e26]/10"></div>

      {/* Animated circles */}
      <div className="absolute right-1/4 top-1/3 h-4 w-4 rounded-full bg-[#e41e26]/20 animate-ping"></div>
      <div className="absolute bottom-1/4 left-1/3 h-3 w-3 rounded-full bg-[#e41e26]/30 animate-ping animation-delay-700"></div>


      <div className="container mx-auto py-12 px-4 md:px-6 relative">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">NOSOTROS</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Conoce más sobre TECCEL MOCOA, nuestra historia, misión y visión para ofrecerte los mejores productos y servicios.
          </p>
        </div>

        {/* Sección: Nuestra Misión */}
        <div className="flex flex-col md:flex-row gap-12 items-center mt-20">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
            <p className="mb-4">
              En TECCEL MOCOA, nuestra misión es proporcionar a nuestros clientes productos tecnológicos de la más alta calidad, con un servicio excepcional y personalizado.
            </p>
            <p className="mb-4">Nos comprometemos a:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ofrecer productos de las mejores marcas y con garantía</li>
              <li>Brindar asesoría especializada a cada cliente</li>
              <li>Mantenernos actualizados con las últimas tendencias tecnológicas</li>
              <li>Contribuir al desarrollo tecnológico de nuestra región</li>
            </ul>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Target className="h-24 w-24 text-red-500" />
          </div>
        </div>

        <div className="my-24"></div>

        {/* Sección: Nuestra Historia */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <Users className="h-10 w-10 text-red-500" />
                <div>
                  <h4 className="font-bold text-xl">+1,000</h4>
                  <p className="text-muted-foreground">Clientes satisfechos</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Building2 className="h-10 w-10 text-red-500" />
                <div>
                  <h4 className="font-bold text-xl">10+ años</h4>
                  <p className="text-muted-foreground">De experiencia</p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Nuestra Historia</h3>
            <p className="mb-4">
              TECCEL MOCOA nació con la visión de llevar la mejor tecnología a nuestra comunidad. Desde nuestros inicios, nos hemos dedicado a ofrecer productos de calidad y un servicio excepcional que nos ha permitido ganar la confianza de más de 1,000 clientes satisfechos.
            </p>
            <p>
              Trabajamos con las mejores marcas del mercado como Samsung, Apple, Huawei y muchas más, garantizando siempre la autenticidad y calidad de todos nuestros productos.
            </p>
          </div>
        </div>

        <div className="my-24"></div>

        {/* Sección: Nuestra Visión */}
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <h3 className="text-2xl font-bold mb-4">Nuestra Visión</h3>
            <p className="mb-4">
              Ser reconocidos como la empresa líder en distribución de tecnología en la región, distinguiéndonos por la excelencia en el servicio, la calidad de nuestros productos y nuestro compromiso con la satisfacción del cliente.
            </p>
            <p className="mb-4">Aspiramos a:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Expandir nuestra presencia a nivel nacional</li>
              <li>Ser referentes en innovación y servicio al cliente</li>
              <li>Desarrollar alianzas estratégicas con las mejores marcas</li>
              <li>Contribuir al desarrollo tecnológico y digital de nuestra comunidad</li>
            </ul>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Eye className="h-24 w-24 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  )
}