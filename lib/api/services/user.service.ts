/**
 * User Service
 * Handles user CRUD operations and init data
 */

import apiClient from "../client"
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ApiResponseWithId,
  ApiResponse,
  InitDataResponse,
} from "../types"

export const userService = {
  /**
   * Get initial data (user info and menu)
   */
  async getInitData(): Promise<InitDataResponse> {
    return await apiClient.get<InitDataResponse>("/users/init-data")
  },

  /**
   * Create a new user
   */
  async createUser(data: CreateUserRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/users/create", data)
  },

  /**
   * Update user by ID
   */
  async updateUser(id: number, data: UpdateUserRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/users/update/${id}`, data)
  },

  /**
   * Delete user by ID
   */
  async deleteUser(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/users/delete/${id}`)
  },

  /**
   * Get user by ID
   */
  async getUserById(id: number): Promise<User> {
    return await apiClient.get<User>(`/users/${id}`)
  },

  /**
   * Get all users
   */
  async getAllUsers(): Promise<User[]> {
    return await apiClient.get<User[]>("/users")
  },
}
