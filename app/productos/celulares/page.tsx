import ProductGrid from "@/components/product-grid"
import ProductFilters from "@/components/product-filters"
import { productService } from "@/lib/api/services/product.service"
import { categoryService } from "@/lib/api/services/category.service" // Asumo que tienes este servicio
import { GetProductsParams } from "@/lib/api/types" // Importa tus interfaces

export interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

// Hacemos el componente asíncrono para hacer fetch en el servidor
export default async function CelularesPage({ searchParams }: ProductsPageProps) {
  
  // 1. Preparar los parámetros para la API
  const page = Number(searchParams.page) || 1
  const minPrice = searchParams.minPrice ? Number(searchParams.minPrice) : undefined
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined
  
  // Manejo de subcategorías (puede venir "1" o "1,2")
  // Nota: Tu API actual getProductsPaginated parece recibir un solo 'subcategoryId' (number).
  // Si quieres filtrar por varios, tu backend debería aceptar un array o string separado por comas.
  // Por ahora, tomaremos el primero si hay varios, o ajusta tu backend.
  // Asumiendo que tu backend espera un número:
  const subcategoryIdRaw = searchParams.subcategoryId as string
  const subcategoryId = subcategoryIdRaw ? Number(subcategoryIdRaw.split(',')[0]) : undefined

  const apiParams: GetProductsParams = {
    page,
    perPage: 12, // Mostrar 12 productos por página
    minPrice,
    maxPrice,
    subcategoryId, 
    // categoryId: 1 // Podrías forzar que esta página solo muestre ID 1 (Celulares) si quisieras
  }

  // 2. Cargar datos en paralelo (Productos y Árbol de Categorías para el filtro)
  // Usamos try/catch para manejar errores de conexión con el backend
  let productsData = { rows: [], metadata: { totalItems: 0, totalPages: 0 } }
  let categoriesTree = []

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      productService.getProductsPaginated(apiParams),
      // Necesitamos este endpoint para llenar el sidebar de filtros:
      fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/catalog/categories/tree`).then(res => res.json())
    ])
    
    productsData = productsRes
    categoriesTree = categoriesRes

  } catch (error) {
    console.error("Error cargando productos o categorías:", error)
    // Podrías mostrar un componente de error aquí
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
            <p className="text-gray-500 mt-2">
                Mostrando {productsData.rows.length} de {productsData.metadata?.totalItems || 0} productos
            </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* BARRA LATERAL (FILTROS) */}
        <div className="w-full lg:w-1/4">
          <ProductFilters categories={categoriesTree} />
        </div>

        {/* GRILLA DE PRODUCTOS */}
        <div className="w-full lg:w-3/4">
          {productsData.rows.length > 0 ? (
             // Asegúrate de que ProductGrid acepte el array de productos nuevos
             <ProductGrid products={productsData.rows} />
          ) : (
             <div className="text-center py-20 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No se encontraron productos con estos filtros.</p>
             </div>
          )}
          
          {/* AQUÍ PODRÍAS AGREGAR UN COMPONENTE DE PAGINACIÓN */}
          {/* Usando productsData.metadata para generar los botones de página */}
        </div>
      </div>
    </div>
  )
}