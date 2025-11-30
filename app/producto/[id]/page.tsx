"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingCart, ChevronRight, Check, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { productService } from "@/lib/api/services/product.service";
import type { Product } from "@/lib/api/types"; // Tu tipo actualizado

// Interfaz auxiliar para agrupar atributos en la vista
interface GroupedAttributes {
  groupName: string;
  attributes: { name: string; value: string }[];
}

export default function ProductPage() {
  const params = useParams();
  const id = Number(params.id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [groupedSpecs, setGroupedSpecs] = useState<GroupedAttributes[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) return;
        const data = await productService.getProductById(id);
        setProduct(data);
        
        // Configurar imagen principal inicial
        if (data.images && data.images.length > 0) {
            setSelectedImage(data.images[0].imageUrl);
        }

        // --- LÓGICA DE AGRUPACIÓN DE ESPECIFICACIONES ---
        // Transformamos el array plano 'attributeValues' en grupos ordenados
        if ((data as any).attributeValues) {
            const rawAttrs = (data as any).attributeValues;
            const groupsMap = new Map<string, { name: string; value: string }[]>();

            rawAttrs.forEach((av: any) => {
                const groupName = av.attribute?.attributeGroup?.name || "Otros";
                const attrName = av.attribute?.name || "Característica";
                const value = av.value;

                if (!groupsMap.has(groupName)) {
                    groupsMap.set(groupName, []);
                }
                groupsMap.get(groupName)?.push({ name: attrName, value });
            });

            // Convertimos el Map a Array
            const specsArray: GroupedAttributes[] = Array.from(groupsMap.entries()).map(([name, attrs]) => ({
                groupName: name,
                attributes: attrs
            }));
            
            setGroupedSpecs(specsArray);
        }

      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleWhatsAppBuy = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hola, estoy interesado en comprar el ${product.name} (Código: ${product.code}). ¿Está disponible?`
    );
    // Asegúrate de definir tu URL base en .env
    const productUrl = window.location.href; 
    window.open(`https://wa.me/+573229004323?text=${message} ${productUrl}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e41e26]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
        <Button asChild className="bg-[#e41e26] hover:bg-[#c41a21]">
          <a href="/">Volver a la tienda</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-[#e41e26] transition-colors">Inicio</a>
        <ChevronRight className="h-4 w-4 mx-2" />
        <a href="/productos" className="hover:text-[#e41e26] transition-colors">Catálogo</a>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* GALERÍA DE IMÁGENES */}
        <div className="flex flex-col gap-4">
          {/* Imagen Principal */}
          <div className="relative w-full aspect-square bg-white rounded-xl border shadow-sm overflow-hidden flex items-center justify-center p-6">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
            {!product.isActive && (
                <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded text-xs">Agotado / Inactivo</div>
            )}
            {product.priceDiscount && (
                <Badge className="absolute top-4 right-4 bg-[#e41e26] text-white">Oferta</Badge>
            )}
          </div>

          {/* Miniaturas (Solo si hay más de una) */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                    <button 
                        key={img.id} 
                        onClick={() => setSelectedImage(img.imageUrl)}
                        className={`relative w-20 h-20 flex-shrink-0 border rounded-lg overflow-hidden bg-white ${selectedImage === img.imageUrl ? 'ring-2 ring-[#e41e26]' : 'hover:border-gray-400'}`}
                    >
                        <Image src={img.imageUrl} alt={`Vista ${idx}`} fill className="object-contain p-1"/>
                    </button>
                ))}
            </div>
          )}
        </div>

        {/* DETALLES DEL PRODUCTO */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-900">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">SKU: {product.code}</p>
            
            {/* Precios */}
            <div className="flex items-baseline gap-4 mb-6">
              {product.priceDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-[#e41e26]">{formatPrice(product.priceDiscount)}</span>
                    <span className="text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
                  </>
              ) : (
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Descripción Corta */}
            {product.description && (
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {product.description}
                </p>
            )}

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1 gap-2 bg-[#e41e26] hover:bg-[#c41a21] text-white"
                onClick={handleWhatsAppBuy}
                disabled={!product.isActive || product.stock <= 0}
              >
                <ShoppingCart className="h-5 w-5" />
                {product.stock > 0 ? "Comprar por WhatsApp" : "Agotado"}
              </Button>
            </div>

            {/* Beneficios / Garantía */}
            <Card className="bg-gray-50 border-none shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Envío Seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Garantía Directa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Soporte 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">Original 100%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* PESTAÑAS DE ESPECIFICACIONES DINÁMICAS */}
      <div className="mt-16">
        <Tabs defaultValue="specifications">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
            <TabsTrigger 
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#e41e26] data-[state=active]:bg-transparent data-[state=active]:text-[#e41e26] px-6 py-3"
            >
                Especificaciones Técnicas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="specifications" className="mt-8">
            {groupedSpecs.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Renderizamos cada grupo como una tarjeta */}
                    {groupedSpecs.map((group, index) => (
                        <Card key={index} className="overflow-hidden border shadow-sm">
                            <div className="bg-gray-50 px-6 py-3 border-b">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-[#e41e26]" />
                                    {group.groupName}
                                </h3>
                            </div>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {group.attributes.map((attr, idx) => (
                                        <div key={idx} className="flex justify-between px-6 py-3 hover:bg-gray-50/50">
                                            <span className="text-sm text-gray-500 font-medium">{attr.name}</span>
                                            <span className="text-sm text-gray-900 font-semibold text-right">{attr.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                    No hay especificaciones técnicas detalladas para este producto.
                </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}