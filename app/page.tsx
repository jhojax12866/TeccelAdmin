import Hero from "@/components/hero"
import ProductsSection from "@/components/product-section"
import StoreLocation from "@/components/store-location"


export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />

      <ProductsSection />

      <StoreLocation />

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{/* Your existing cards here */}</div>
        </div>
      </section>
    </div>
  )
}



