import apiClient from "../client";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ApiResponseWithId,
  ApiResponse,
  GetProductsParams,
  PaginatedResponse,
} from "../types";

export const productService = {
  async createProduct(data: CreateProductRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/products", data);
  },

  async getProductsPaginated(
    params: GetProductsParams
  ): Promise<PaginatedResponse<Product>> {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, val]) => {
        if (val !== undefined && val !== null) acc[key] = String(val);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return await apiClient.get<PaginatedResponse<Product>>(
      `/catalog/products/products-paginated?${query}`
    );
  },

  async updateProduct(
    id: number,
    data: UpdateProductRequest
  ): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/products/${id}`, data);
  },

  async deleteProduct(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/products/${id}`);
  },

  async getProductById(id: number): Promise<Product> {
    return await apiClient.get<Product>(`/catalog/products/${id}`);
  },
};
