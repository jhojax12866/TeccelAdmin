"use client"

import { Building2, Target, Eye, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export default function AboutUs() {
  const missionRef = useRef(null)
  const historyRef = useRef(null)
  const visionRef = useRef(null)

  const missionInView = useInView(missionRef, { once: true, amount: 0.3 })
  const historyInView = useInView(historyRef, { once: true, amount: 0.3 })
  const visionInView = useInView(visionRef, { once: true, amount: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <motion.div className="relative overflow-hidden" initial="hidden" animate="visible" variants={containerVariants}>
      {/* Fondo animado */}
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#e41e26]/5"></div>
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#e41e26]/5"></div>
      <div className="absolute left-1/4 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-[#e41e26]/10"></div>

      {/* Animated circles */}
      <div className="absolute right-1/4 top-1/3 h-4 w-4 rounded-full bg-[#e41e26]/20 animate-ping"></div>
      <div className="absolute bottom-1/4 left-1/3 h-3 w-3 rounded-full bg-[#e41e26]/30 animate-ping animation-delay-700"></div>

      <div className="container mx-auto py-12 px-4 md:px-6 relative">
        {/* Sección: Nuestra Misión */}
        <motion.div
          className="flex flex-col md:flex-row gap-12 items-center mt-20"
          ref={missionRef}
          initial="hidden"
          animate={missionInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <motion.h3 className="text-2xl font-bold mb-4" variants={itemVariants}>
              Nuestra Misión
            </motion.h3>
            <motion.p className="mb-4" variants={itemVariants}>
              En TECCEL MOCOA, nuestra misión es proporcionar a nuestros clientes productos tecnológicos de la más alta
              calidad, con un servicio excepcional y personalizado.
            </motion.p>
            <motion.p className="mb-4" variants={itemVariants}>
              Nos comprometemos a:
            </motion.p>
            <motion.ul className="list-disc pl-5 space-y-2" variants={itemVariants}>
              <motion.li variants={itemVariants}>Ofrecer productos de las mejores marcas y con garantía</motion.li>
              <motion.li variants={itemVariants}>Brindar asesoría especializada a cada cliente</motion.li>
              <motion.li variants={itemVariants}>
                Mantenernos actualizados con las últimas tendencias tecnológicas
              </motion.li>
              <motion.li variants={itemVariants}>Contribuir al desarrollo tecnológico de nuestra región</motion.li>
            </motion.ul>
          </motion.div>
          <motion.div
            className="md:w-1/2 flex justify-center"
            variants={itemVariants}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Target className="h-24 w-24 text-red-500" />
          </motion.div>
        </motion.div>

        <div className="my-24"></div>

        {/* Sección: Nuestra Historia */}
        <motion.div
          className="flex flex-col md:flex-row gap-12 items-center"
          ref={historyRef}
          initial="hidden"
          animate={historyInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <motion.div className="md:w-1/2 flex justify-center" variants={itemVariants}>
            <motion.div
              className="bg-white p-6 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div className="flex items-center gap-4 mb-4" variants={itemVariants}>
                <Users className="h-10 w-10 text-red-500" />
                <div>
                  <h4 className="font-bold text-xl">+1,000</h4>
                  <p className="text-muted-foreground">Clientes satisfechos</p>
                </div>
              </motion.div>
              <motion.div className="flex items-center gap-4" variants={itemVariants}>
                <Building2 className="h-10 w-10 text-red-500" />
                <div>
                  <h4 className="font-bold text-xl">10+ años</h4>
                  <p className="text-muted-foreground">De experiencia</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="md:w-1/2" variants={itemVariants}>
            <motion.h3 className="text-2xl font-bold mb-4" variants={itemVariants}>
              Nuestra Historia
            </motion.h3>
            <motion.p className="mb-4" variants={itemVariants}>
              TECCEL MOCOA nació con la visión de llevar la mejor tecnología a nuestra comunidad. Desde nuestros
              inicios, nos hemos dedicado a ofrecer productos de calidad y un servicio excepcional que nos ha permitido
              ganar la confianza de más de 1,000 clientes satisfechos.
            </motion.p>
            <motion.p variants={itemVariants}>
              Trabajamos con las mejores marcas del mercado como Samsung, Apple, Huawei y muchas más, garantizando
              siempre la autenticidad y calidad de todos nuestros productos.
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="my-24"></div>

        {/* Sección: Nuestra Visión */}
        <motion.div
          className="flex flex-col md:flex-row gap-12 items-center"
          ref={visionRef}
          initial="hidden"
          animate={visionInView ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <motion.div className="md:w-1/2" variants={itemVariants}>
            <motion.h3 className="text-2xl font-bold mb-4" variants={itemVariants}>
              Nuestra Visión
            </motion.h3>
            <motion.p className="mb-4" variants={itemVariants}>
              Ser reconocidos como la empresa líder en distribución de tecnología en la región, distinguiéndonos por la
              excelencia en el servicio, la calidad de nuestros productos y nuestro compromiso con la satisfacción del
              cliente.
            </motion.p>
            <motion.p className="mb-4" variants={itemVariants}>
              Aspiramos a:
            </motion.p>
            <motion.ul className="list-disc pl-5 space-y-2" variants={itemVariants}>
              <motion.li variants={itemVariants}>Expandir nuestra presencia a nivel nacional</motion.li>
              <motion.li variants={itemVariants}>Ser referentes en innovación y servicio al cliente</motion.li>
              <motion.li variants={itemVariants}>Desarrollar alianzas estratégicas con las mejores marcas</motion.li>
              <motion.li variants={itemVariants}>
                Contribuir al desarrollo tecnológico y digital de nuestra comunidad
              </motion.li>
            </motion.ul>
          </motion.div>
          <motion.div
            className="md:w-1/2 flex justify-center"
            variants={itemVariants}
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Eye className="h-24 w-24 text-red-500" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}