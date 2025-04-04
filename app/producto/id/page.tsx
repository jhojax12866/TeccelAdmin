import Image from "next/image"
import { notFound } from "next/navigation"
import { Facebook, Twitter, Instagram, Share2 } from "lucide-react"
import ProductTabs from "@/components/product-tabs"
import { Product } from "@/app/productos/category/page"


// Función para obtener todos los productos
async function getAllProducts(): Promise<Product[]> {
  try {
    const productsModule = await import("@/public/data/products.json")
    return productsModule.default || []
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return []
  }
}

// Función para obtener un producto por ID o slug
async function getProduct(idOrSlug: string): Promise<Product | null> {
  try {
    const products = await getAllProducts()

    // Primero intentamos buscar por ID exacto
    let product = products.find((p: Product) => p.id === idOrSlug)

    // Si no encontramos por ID, intentamos buscar por un slug generado
    if (!product) {
      // Convertimos el slug de la URL a un formato que podamos comparar
      const normalizedSlug = idOrSlug.toLowerCase()

      product = products.find((p: Product) => {
        // Generamos un slug para cada producto
        const productSlug = `${p.brand.toLowerCase()}-${p.model.toLowerCase().replace(/\s+/g, "-")}-${p.storage.toLowerCase()}`
        return productSlug === normalizedSlug
      })
    }

    return product || null
  } catch (error) {
    console.error("Error al obtener el producto:", error)
    return null
  }
}

// Esta función es necesaria para la generación estática con output: export
export async function generateStaticParams() {
  const products = await getAllProducts()

  return products.map((product: Product) => {
    // Generamos un slug para cada producto
    const slug = `${product.brand.toLowerCase()}-${product.model.toLowerCase().replace(/\s+/g, "-")}-${product.storage.toLowerCase()}`

    return {
      id: slug,
    }
  })
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    return {
      title: "Producto no encontrado | TECCEL MOCOA",
    }
  }

  return {
    title: `${product.brand} ${product.model} | TECCEL MOCOA`,
    description: `${product.brand} ${product.model} ${product.storage} - Disponible en TECCEL MOCOA`,
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    console.log(`Producto no encontrado para ID/slug: ${params.id}`)
    notFound()
  }

  // Datos adicionales del producto (en un caso real, estos vendrían de la base de datos)
  const productDetails = {
    colors: ["black", "blue", "green"],
    description: `El ${product.brand} ${product.model} es un smartphone de última generación con excelentes características. Con ${product.storage} de almacenamiento, tendrás espacio suficiente para todas tus aplicaciones, fotos y videos.`,
    features: [
      "Pantalla AMOLED de alta resolución",
      `Almacenamiento de ${product.storage}`,
      "Cámara de alta resolución",
      "Batería de larga duración",
      "Procesador de alto rendimiento",
    ],
    specifications: {
      Pantalla: "6.5 pulgadas AMOLED",
      Procesador: "Octa-core 2.4GHz",
      RAM: "8GB",
      Almacenamiento: product.storage,
      "Cámara principal": "48MP + 12MP + 5MP",
      "Cámara frontal": "32MP",
      Batería: "5000mAh",
      "Sistema operativo": "Android 13",
    },
  }

  // Formatear el precio
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price)

  // Precio original (10% más alto para mostrar descuento)
  const originalPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price * 1.1)

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Galería de imágenes */}
        <div className="space-y-4">
          <div className="relative overflow-hidden bg-white border rounded-lg aspect-square">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={`${product.brand} ${product.model}`}
              fill
              className="object-contain p-4"
            />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative overflow-hidden bg-white border rounded-lg cursor-pointer aspect-square">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.brand} ${product.model} - Vista ${i}`}
                  fill
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold md:text-3xl">
            {product.brand} {product.model}
          </h1>

          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#e41e26]">{formattedPrice}</span>
            <span className="text-lg text-gray-500 line-through">{originalPrice}</span>
          </div>

          {/* Selector de color */}
          <div className="space-y-2">
            <h3 className="font-medium">Color</h3>
            <div className="flex space-x-2">
              {productDetails.colors.map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 border-2 rounded-full cursor-pointer ${
                    color === "black"
                      ? "bg-black border-gray-400"
                      : color === "blue"
                        ? "bg-blue-500 border-blue-300"
                        : "bg-green-500 border-green-300"
                  }`}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </div>
          </div>

          {/* Selector de almacenamiento */}
          <div className="space-y-2">
            <h3 className="font-medium">Almacenamiento</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 text-sm border rounded-md">64GB</button>
              <button className="px-4 py-2 text-sm text-white border rounded-md bg-[#e41e26]">128GB</button>
              <button className="px-4 py-2 text-sm border rounded-md">256GB</button>
            </div>
          </div>

          

          {/* Tiempo de entrega */}
          <p className="text-sm text-gray-600">Entrega estimada: 2-3 días hábiles</p>

          {/* Métodos de pago */}
          <div className="space-y-2">
            <h3 className="font-medium">Métodos de pago:</h3>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1 text-xs border rounded-md">Visa</div>
              <div className="px-3 py-1 text-xs border rounded-md">MasterCard</div>
              <div className="px-3 py-1 text-xs border rounded-md">PayPal</div>
              <div className="px-3 py-1 text-xs border rounded-md">Efectivo</div>
              <div className="px-3 py-1 text-xs border rounded-md">Transferencia</div>
            </div>
          </div>

          {/* Compartir */}
          <div className="space-y-2">
            <h3 className="font-medium">Compartir:</h3>
            <div className="flex space-x-2">
              <button className="p-2 text-white rounded-full bg-[#e41e26]">
                <Facebook size={16} />
              </button>
              <button className="p-2 text-white rounded-full bg-[#e41e26]">
                <Twitter size={16} />
              </button>
              <button className="p-2 text-white rounded-full bg-[#e41e26]">
                <Instagram size={16} />
              </button>
              <button className="p-2 text-white rounded-full bg-[#e41e26]">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="font-medium">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 text-xs bg-gray-100 rounded-md">Smartphone</span>
              <span className="px-3 py-1 text-xs bg-gray-100 rounded-md">{product.brand}</span>
              <span className="px-3 py-1 text-xs bg-gray-100 rounded-md">{product.storage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de información del producto */}
      <div className="mt-12">
        <ProductTabs
          description={productDetails.description}
          features={productDetails.features}
          specifications={productDetails.specifications}
        />
      </div>
    </div>
  )
}

