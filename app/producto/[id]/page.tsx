"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, ChevronRight, Check, Phone, Cpu, Battery, Wifi, Bluetooth } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Import the product data
import productsData from "@/public/data/products.json"

// Define the Product type based on the JSON structure
type Color = {
  name: string;
  code: string;
};

type Specifications = {
  display: {
    type: string;
    size: string;
    resolution: string;
    refresh_rate: string;
  };
  processor: {
    chipset: string;
    cores: string;
    gpu: string;
  };
  camera: {
    main: string;
    ultrawide?: string;
    macro?: string;
    depth?: string;
    front: string;
  };
  battery: {
    capacity: string;
    charging: string;
  };
  connectivity: {
    wifi: string;
    bluetooth: string;
    nfc: boolean;
    usb: string;
  };
  dimensions: string;
  weight: string;
  os: string;
  additional_features: {
    fingerprint: string;
    waterproof: string;
    headphone_jack: boolean;
    stereo_speakers?: boolean;
    dolby_atmos?: boolean;
    knox_security?: boolean;
  };
};

type Product = {
  id: string;
  brand: string;
  model: string;
  storage: string;
  ram: string;
  price: number;
  image: string;
  featured: boolean;
  colors: Color[];
  specifications: Specifications;
};

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the product with the matching ID
    const foundProduct = productsData.find(p => p.id === id);
    if (foundProduct) {
      const transformedProduct = {
        ...foundProduct,
        colors: foundProduct.colors.map(color => ({
          name: color.name,
          code: 'code' in color ? color.code : color.hex,
        })),
      };
      setProduct(transformedProduct);
      setSelectedColor(transformedProduct.colors[0].name);
    }
    setIsLoading(false);
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
      `Hola, estoy interesado en comprar el ${product.brand} ${product.model} (${product.storage}/${product.ram}) en color ${selectedColor}. ¿Está disponible?`
    );
    const productUrl = encodeURIComponent(`${window.location.origin}/producto/${product.id}`);
    window.open(`https://wa.me/+573229004323?text=${message} ${productUrl}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
        <p className="mb-8">Lo sentimos, el producto que estás buscando no existe.</p>
        <Button asChild>
          <a href="/">Volver a la tienda</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-primary transition-colors">Inicio</a>
        <ChevronRight className="h-4 w-4 mx-2" />
        <a href={`/marca/${product.brand.toLowerCase()}`} className="hover:text-primary transition-colors">{product.brand}</a>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{product.model}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-square mb-4 bg-white rounded-xl p-8 border shadow-sm">
            <Image
              src={product.image || "/placeholder.svg?height=500&width=500"}
              alt={`${product.brand} ${product.model}`}
              fill
              className="object-contain p-4"
              priority
            />
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-primary text-white">Destacado</Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.brand} {product.model}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= 4 ? "fill-primary text-primary" : "fill-muted text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(120 reseñas)</span>
            </div>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price * 1.2)}</span>
              <Badge variant="outline" className="text-green-600 border-green-600">20% Descuento</Badge>
            </div>

            <div className="grid gap-4 mb-6">
              <div>
                <h3 className="font-medium mb-2">Almacenamiento: <span className="font-bold">{product.storage}</span></h3>
                <h3 className="font-medium mb-2">Memoria RAM: <span className="font-bold">{product.ram}</span></h3>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Color:</h3>
                <RadioGroup 
                  value={selectedColor} 
                  onValueChange={setSelectedColor}
                  className="flex flex-wrap gap-3"
                >
                  {product.colors.map((color) => (
                    <div key={color.name} className="flex flex-col items-center gap-1">
                      <Label
                        htmlFor={`color-${color.name}`}
                        className="cursor-pointer flex flex-col items-center gap-1"
                      >
                        <div 
                          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
                          style={{ backgroundColor: color.code || color.code, borderColor: selectedColor === color.name ? '#000' : 'transparent' }}
                        >
                          {selectedColor === color.name && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <RadioGroupItem 
                          id={`color-${color.name}`} 
                          value={color.name} 
                          className="sr-only" 
                        />
                        <span className="text-xs">{color.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                className="flex-1 gap-2"
                onClick={handleWhatsAppBuy}
              >
                <ShoppingCart className="h-5 w-5" />
                Comprar Ahora
              </Button>
              <Button variant="outline" size="lg" className="flex-1 gap-2">
                <Heart className="h-5 w-5" />
                Añadir a Favoritos
              </Button>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Envío Gratis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Garantía 12 meses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Pago Seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Soporte 24/7</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mt-12">
        <Tabs defaultValue="specifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
            <TabsTrigger value="features">Características</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          </TabsList>
          <TabsContent value="specifications" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Pantalla
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo</span>
                      <span className="font-medium">{product.specifications.display.type}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tamaño</span>
                      <span className="font-medium">{product.specifications.display.size}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolución</span>
                      <span className="font-medium">{product.specifications.display.resolution}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tasa de refresco</span>
                      <span className="font-medium">{product.specifications.display.refresh_rate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Procesador
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Chipset</span>
                      <span className="font-medium">{product.specifications.processor.chipset}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Núcleos</span>
                      <span className="font-medium">{product.specifications.processor.cores}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GPU</span>
                      <span className="font-medium">{product.specifications.processor.gpu}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Battery className="h-5 w-5" />
                    Batería
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacidad</span>
                      <span className="font-medium">{product.specifications.battery.capacity}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carga</span>
                      <span className="font-medium">{product.specifications.battery.charging}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Conectividad
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">WiFi</span>
                      <span className="font-medium">{product.specifications.connectivity.wifi}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bluetooth</span>
                      <span className="font-medium">{product.specifications.connectivity.bluetooth}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NFC</span>
                      <span className="font-medium">{product.specifications.connectivity.nfc ? 'Sí' : 'No'}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">USB</span>
                      <span className="font-medium">{product.specifications.connectivity.usb}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Cámara</h3>
                    <div className="grid gap-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Principal</span>
                        <span className="font-medium">{product.specifications.camera.main}</span>
                      </div>
                      <Separator />
                      {product.specifications.camera.ultrawide && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ultra gran angular</span>
                            <span className="font-medium">{product.specifications.camera.ultrawide}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {product.specifications.camera.macro && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Macro</span>
                            <span className="font-medium">{product.specifications.camera.macro}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      {product.specifications.camera.depth && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Profundidad</span>
                            <span className="font-medium">{product.specifications.camera.depth}</span>
                          </div>
                          <Separator />
                        </>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Frontal</span>
                        <span className="font-medium">{product.specifications.camera.front}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Características adicionales</h3>
                    <div className="grid gap-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sensor de huellas</span>
                        <span className="font-medium">{product.specifications.additional_features.fingerprint}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resistencia al agua</span>
                        <span className="font-medium">{product.specifications.additional_features.waterproof}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Conector de auriculares</span>
                        <span className="font-medium">{product.specifications.additional_features.headphone_jack ? 'Sí' : 'No'}</span>
                      </div>
                      {product.specifications.additional_features.stereo_speakers !== undefined && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Altavoces estéreo</span>
                            <span className="font-medium">{product.specifications.additional_features.stereo_speakers ? 'Sí' : 'No'}</span>
                          </div>
                        </>
                      )}
                      {product.specifications.additional_features.dolby_atmos !== undefined && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dolby Atmos</span>
                            <span className="font-medium">{product.specifications.additional_features.dolby_atmos ? 'Sí' : 'No'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Reseñas de clientes</h3>
                <p className="text-muted-foreground mb-4">Aún no hay reseñas para este producto.</p>
                <Button>Escribir una reseña</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
