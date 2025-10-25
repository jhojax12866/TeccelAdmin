export interface Product {
  id: string
  brand: string
  model: string
  storage: string
  price: number
  image: string
  featured?: boolean
  category?: string
}

export interface Specification {
  id: string
  name: string
  description?: string
  value?: string
  productId?: string
  typeId?: string
}

export interface SpecificationType {
  id: string | number
  name: string
  description?: string
}

export interface Category {
  id: number | string
  name: string
  description?: string
}

export interface ProductSpecification {
  id: string
  productId: string
  specificationId: string
  typeId: number | string
  value?: string
}