"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { useInterval } from "@/hooks/use-interval"


interface Brand {
  name: string
  logo: string
}

export default function BrandCarousel() {
    const brands: Brand[] = [
        {
          name: "Xiaomi",
          logo: "/xiaomi.svg?height=200&width=200&text=Xiaomi",
        },
        {
          name: "Apple",
          logo: "/apple.svg?height=200&width=200&text=Apple",
        },
        {
          name: "Samsung",
          logo: "/samsung.svg?height=200&width=200&text=Samsung",
        },
        {
          name: "ZTE",
          logo: "/zte.svg?height=200&width=200&text=ZTE",
        },
      ]

  const [api, setApi] = useState<any>(null)
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  
  useInterval(() => {
    if (api) {
      api.scrollNext()
    }
  }, 3000)

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full max-w-xs sm:max-w-sm md:max-w-md"
    >
      <CarouselContent>
        {brands.map((brand) => (
          <CarouselItem key={brand.name}>
            <div className="p-1">
              <div className="flex aspect-square items-center justify-center p-2">
                <Image
                  src={brand.logo || "/placeholder.svg"}
                  alt={`${brand.name} logo`}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

