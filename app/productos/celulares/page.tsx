
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import { Product } from "../category/page"

export interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CelularesPage({ searchParams }: ProductsPageProps) {
  // Importar dinámicamente los productos
  let allProducts: Product[] = []

  try {
    // Intentar importar el archivo de productos
    const productsModule = await import("@/public/data/products.json")
    allProducts = productsModule.default || []
  } catch (error) {
    console.error("Error al importar los productos:", error)
  }

  // Aplicar filtros si existen en searchParams
  let filteredProducts = [...allProducts]

  // Filtrar por marca si se especifica
  if (searchParams.brand) {
    const brands = Array.isArray(searchParams.brand) ? searchParams.brand : [searchParams.brand]

    filteredProducts = filteredProducts.filter((product) => brands.includes(product.brand))
  }

  // Filtrar por almacenamiento si se especifica
  if (searchParams.storage) {
    const storages = Array.isArray(searchParams.storage) ? searchParams.storage : [searchParams.storage]

    filteredProducts = filteredProducts.filter((product) => storages.includes(product.storage))
  }

  // Filtrar por rango de precio si se especifica
  if (searchParams.minPrice || searchParams.maxPrice) {
    const minPrice = searchParams.minPrice ? Number.parseInt(searchParams.minPrice as string) : 0
    const maxPrice = searchParams.maxPrice ? Number.parseInt(searchParams.maxPrice as string) : Number.POSITIVE_INFINITY

    filteredProducts = filteredProducts.filter((product) => product.price >= minPrice && product.price <= maxPrice)
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Celulares</h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-1/4">
          <ProductFilters products={allProducts} />
        </div>

        <div className="w-full lg:w-3/4">
          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  )
}

