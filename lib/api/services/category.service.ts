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
  async createCategory(data: CreateCategoryRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/categories", data)
  },

  async getAllCategories(): Promise<Category[]> {
    return await apiClient.get<Category[]>("/catalog/categories")
  },

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/categories/${id}`, data)
  },

  async deleteCategory(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/categories/${id}`)
  },

  async getCategoryById(id: number): Promise<Category> {
    return await apiClient.get<Category>(`/catalog/categories/${id}`)
  },

  async createSubcategory(data: CreateSubcategoryRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/categories/subcategories", data)
  },

  async updateSubcategory(id: number, data: UpdateSubcategoryRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/categories/subcategories/${id}`, data)
  },

  async deleteSubcategory(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/categories/subcategories/${id}`)
  },

  async getSubcategoryById(id: number): Promise<Subcategory> {
    return await apiClient.get<Subcategory>(`/catalog/categories/subcategories/${id}`)
  },

  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    return await apiClient.get<Subcategory[]>(`/catalog/categories/subcategories/by-category/${categoryId}`)
  },
}
