/**
 * Category Service
 * Handles category and subcategory operations
 */

import apiClient from "../client"
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  Subcategory,
  CreateSubcategoryRequest,
  UpdateSubcategoryRequest,
  ApiResponseWithId,
  ApiResponse,
} from "../types"

export const categoryService = {
  // ===== Categories =====

  /**
   * Create a new category
   */
  async createCategory(data: CreateCategoryRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/categories", data)
  },

  /**
   * Get all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return await apiClient.get<Category[]>("/catalog/categories")
  },

  /**
   * Update category by ID
   */
  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/categories/${id}`, data)
  },

  /**
   * Delete category by ID
   */
  async deleteCategory(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/categories/${id}`)
  },

  /**
   * Get category by ID
   */
  async getCategoryById(id: number): Promise<Category> {
    return await apiClient.get<Category>(`/catalog/categories/${id}`)
  },

  // ===== Subcategories =====

  /**
   * Create a new subcategory
   */
  async createSubcategory(data: CreateSubcategoryRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/categories/subcategories", data)
  },

  /**
   * Update subcategory by ID
   */
  async updateSubcategory(id: number, data: UpdateSubcategoryRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/categories/subcategories/${id}`, data)
  },

  /**
   * Delete subcategory by ID
   */
  async deleteSubcategory(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/categories/subcategories/${id}`)
  },

  /**
   * Get subcategory by ID
   */
  async getSubcategoryById(id: number): Promise<Subcategory> {
    return await apiClient.get<Subcategory>(`/catalog/categories/subcategories/${id}`)
  },

  /**
   * Get subcategories by category ID
   */
  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return await apiClient.get<Subcategory[]>(`/catalog/categories/subcategories/by-category/${categoryId}`)
  },
}
