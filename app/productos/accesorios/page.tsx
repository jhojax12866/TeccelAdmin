
import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import { Product } from "../category/page"

export interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AccesoriosPage({ searchParams }: ProductsPageProps) {
  // Por ahora, usaremos un array vacío para los accesorios
  // En un caso real, tendrías que importar los datos de accesorios
  const accesorios: Product[] = []

  return (
    <div className="container px-4 py-12 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Accesorios</h1>

      {accesorios.length > 0 ? (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <ProductFilters products={accesorios} />
          </div>

          <div className="w-full lg:w-3/4">
            <ProductGrid products={accesorios} />
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg shadow">
          <h2 className="mb-4 text-xl font-semibold">Próximamente</h2>
          <p className="text-gray-600">
            Estamos trabajando para traerte los mejores accesorios para tus dispositivos. ¡Vuelve pronto para descubrir
            nuestra selección!
          </p>
        </div>
      )}
    </div>
  )
}

