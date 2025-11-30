import apiClient from "../client"
import type { Product, CreateProductRequest, UpdateProductRequest, ApiResponseWithId, ApiResponse } from "../types"

export const productService = {
  async createProduct(data: CreateProductRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/products", data)
  },

  async getAllProducts(): Promise<Product[]> {
    return await apiClient.get<Product[]>("/catalog/products")
  },

  async updateProduct(id: number, data: UpdateProductRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/products/${id}`, data)
  },

  async deleteProduct(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/products/${id}`)
  },

  async getProductById(id: number): Promise<Product> {
    return await apiClient.get<Product>(`/catalog/products/${id}`)
  },
}
