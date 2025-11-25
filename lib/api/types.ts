/**
 * API Type Definitions
 * All TypeScript interfaces for API requests and responses
 */

// Common Response Types
export interface ApiResponse {
  message: string
  statusCode: number
}

export interface ApiResponseWithId extends ApiResponse {
  id: number
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface RefreshTokenRequest {
  accesToken: string // Note: API has typo "accesToken" instead of "accessToken"
}

// User Types
export interface UserRole {
  id: number
  name: string
}

export interface User {
  id: number
  firstName: string
  secondName?: string
  firstLastName: string
  secondLastName?: string
  email: string
  tel?: string
  roles: UserRole[]
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  firstName: string
  secondName?: string
  firstLastName: string
  secondLastName?: string
  email: string
  password: string
  tel?: string
  roles: number[]
}

export interface UpdateUserRequest {
  firstName?: string
  secondName?: string
  firstLastName?: string
  secondLastName?: string
  email?: string
  password?: string
  tel?: string
  roles?: number[]
}

export interface InitDataResponse {
  user: User
  menu: MenuItem[]
}

export interface MenuItem {
  id: number
  name: string
  path: string
  icon?: string
  children?: MenuItem[]
}

// Category Types
export interface Category {
  id: number
  name: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  isActive: boolean
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  isActive?: boolean
}

// Subcategory Types
export interface Subcategory {
  id: number
  name: string
  description?: string
  categoryId: number
  category?: Category
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSubcategoryRequest {
  name: string
  description?: string
  categoryId: number
  isActive: boolean
}

export interface UpdateSubcategoryRequest {
  name?: string
  description?: string
  categoryId?: number
  isActive?: boolean
}

// Attribute Group Types
export interface AttributeGroup {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface CreateAttributeGroupRequest {
  name: string
}

export interface UpdateAttributeGroupRequest {
  name?: string
}

// Attribute Types
export interface Attribute {
  id: number
  name: string
  order: number
  attributeGroupId: number
  attributeGroup?: AttributeGroup
  createdAt: string
  updatedAt: string
}

export interface CreateAttributeRequest {
  name: string
  order: number
  attributeGroupId: number
}

export interface UpdateAttributeRequest {
  name?: string
  order?: number
  attributeGroupId?: number
}

// Product Types
export interface ProductAttributeValue {
  attributeId: number
  value: string
}

export interface Product {
  id: number
  name: string
  description?: string
  code: string
  price: number
  priceDiscount?: number
  stock: number
  isActive: boolean
  images: string[]
  subcategories: Subcategory[]
  attributeValues: ProductAttributeValue[]
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  description?: string
  code: string
  price: number
  priceDiscount?: number
  stock: number
  isActive: boolean
  images: string[]
  subcategoryIds: number[]
  attributeValues: ProductAttributeValue[]
}

export interface UpdateProductRequest {
  name?: string
  description?: string
  code?: string
  price?: number
  priceDiscount?: number
  stock?: number
  isActive?: boolean
  images?: string[]
  subcategoryIds?: number[]
  attributeValues?: ProductAttributeValue[]
}
