/**
 * Product Service
 * Handles product CRUD operations
 */

import apiClient from "../client"
import type { Product, CreateProductRequest, UpdateProductRequest, ApiResponseWithId, ApiResponse } from "../types"

export const productService = {
  /**
   * Create a new product
   */
  async createProduct(data: CreateProductRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/products", data)
  },

  /**
   * Get all products
   */
  async getAllProducts(): Promise<Product[]> {
    return await apiClient.get<Product[]>("/catalog/products")
  },

  /**
   * Update product by ID
   */
  async updateProduct(id: number, data: UpdateProductRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/products/${id}`, data)
  },

  /**
   * Delete product by ID
   */
  async deleteProduct(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/products/${id}`)
  },

  /**
   * Get product by ID
   */
  async getProductById(id: number): Promise<Product> {
    return await apiClient.get<Product>(`/catalog/products/${id}`)
  },
}
