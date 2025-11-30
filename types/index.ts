// src/types/index.ts

// ==========================================
// 1. Interfaces para la UI (Frontend)
// ==========================================

export interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  price: number;
  priceDiscount?: number;
  stock: number;
  image: string;
  category: string;
  isActive: boolean;
  // Estos campos opcionales pueden servir si en el futuro necesitas más detalles
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// 2. Interfaces para la API (Backend Response)
// ==========================================

// Esta interfaz debe coincidir EXACTAMENTE con el JSON que te devuelve el backend
export interface ApiProductRaw {
  id: number;
  name: string;
  description: string;
  code: string;
  price: number;
  // Nota: En tu JSON venía todo en minúscula, así que lo definimos así para evitar errores
  pricediscount: number | null;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  // Array de imágenes
  images: {
    id: number;
    productId: number;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  }[];

  // Estructura anidada de categorías
  productSubcategories: {
    id: number;
    productId: number;
    subcategoryId: number;
    subcategory: {
      id: number;
      name: string;
      description: string;
      categoryId: string;
      isActive: boolean;
      category: {
        id: number;
        name: string;
        description: string;
        isActive: boolean;
      };
    };
  }[];
}

// ==========================================
// 3. Interfaces para Paginación
// ==========================================

export interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  itemsPerPage: number;
  currentPage: number;
  searchTerm: string;
  nextPage: number | null;
}

export interface PaginatedResponse<T> {
  rows: T[];
  metadata: PaginationMetadata;
}

export interface CategoryTree {
  id: number;
  name: string;
  subcategories: Subcategory[]; // El array anidado que nos mostraste
}

// En src/lib/api/types.ts

export interface Attribute {
  id: number;
  name: string;
  // ... otros campos
}

export interface AttributeGroup {
  id: number;
  name: string;
  // Agregamos esto, ya que tu API lo devuelve anidado
  attributes: Attribute[];
}
