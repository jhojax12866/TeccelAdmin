import { notFound } from "next/navigation"
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import products from "@/public/data/products.json" 

// Definimos los tipos para los productos
export interface Product {
  id: string
  brand: string
  model: string
  storage: string
  price: number
  image: string
  featured?: boolean
}

// Definimos las categorías y asignamos productos a cada una
const categories: Record<string, Product[]> = {
  celulares: products as Product[],
  accesorios: [], // Aquí deberías tener tus datos de accesorios
  otros: [], // Aquí deberías tener tus datos de otros productos
}

export function generateMetadata({ params }: { params: { category: string } }) {
  const category = params.category

  if (!categories[category]) {
    return {
      title: "Categoría no encontrada",
    }
  }

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  return {
    title: `${categoryName} | TECCEL MOCOA`,
    description: `Explora nuestra colección de ${categoryName.toLowerCase()} en TECCEL MOCOA`,
  }
}

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params

  if (!categories[category]) {
    notFound()
  }

  const categoryProducts = categories[category]
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">{categoryName}</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <ProductFilters products={categoryProducts} />
        </div>

        <div className="w-full lg:w-3/4">
          <ProductGrid products={categoryProducts} />
        </div>
      </div>
    </div>
  )
}

