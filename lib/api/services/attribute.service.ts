/**
 * Attribute Service
 * Handles attribute groups and attributes operations
 */

import apiClient from "../client"
import type {
  AttributeGroup,
  CreateAttributeGroupRequest,
  UpdateAttributeGroupRequest,
  Attribute,
  CreateAttributeRequest,
  UpdateAttributeRequest,
  ApiResponseWithId,
  ApiResponse,
} from "../types"

export const attributeService = {
  // ===== Attribute Groups =====

  /**
   * Create a new attribute group
   */
  async createAttributeGroup(data: CreateAttributeGroupRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/attributes/groups", data)
  },

  /**
   * Get all attribute groups
   */
  async getAllAttributeGroups(): Promise<AttributeGroup[]> {
    return await apiClient.get<AttributeGroup[]>("/catalog/attributes/groups")
  },

  /**
   * Update attribute group by ID
   */
  async updateAttributeGroup(id: number, data: UpdateAttributeGroupRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/attributes/groups/${id}`, data)
  },

  /**
   * Delete attribute group by ID
   */
  async deleteAttributeGroup(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/attributes/groups/${id}`)
  },

  /**
   * Get attribute group by ID
   */
  async getAttributeGroupById(id: number): Promise<AttributeGroup> {
    return await apiClient.get<AttributeGroup>(`/catalog/attributes/groups/${id}`)
  },

  // ===== Attributes =====

  /**
   * Create a new attribute
   */
  async createAttribute(data: CreateAttributeRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/attributes", data)
  },

  /**
   * Update attribute by ID
   */
  async updateAttribute(id: number, data: UpdateAttributeRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/attributes/${id}`, data)
  },

  /**
   * Delete attribute by ID
   */
  async deleteAttribute(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/attributes/${id}`)
  },

  /**
   * Get attribute by ID
   */
  async getAttributeById(id: number): Promise<Attribute> {
    return await apiClient.get<Attribute>(`/catalog/attributes/${id}`)
  },

  /**
   * Get attributes by group ID
   */
  async getAttributesByGroup(groupId: number): Promise<Attribute[]> {
    return await apiClient.get<Attribute[]>(`/catalog/attributes/by-group/${groupId}`)
  },
}
