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
  async createAttributeGroup(data: CreateAttributeGroupRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/attributes/groups", data)
  },

  async getAllAttributeGroups(): Promise<AttributeGroup[]> {
    return await apiClient.get<AttributeGroup[]>("/catalog/attributes/groups")
  },

  async updateAttributeGroup(id: number, data: UpdateAttributeGroupRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/attributes/groups/${id}`, data)
  },

  async deleteAttributeGroup(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/attributes/groups/${id}`)
  },

  async getAttributeGroupById(id: number): Promise<AttributeGroup> {
    return await apiClient.get<AttributeGroup>(`/catalog/attributes/groups/${id}`)
  },

  async createAttribute(data: CreateAttributeRequest): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/attributes", data)
  },

  async updateAttribute(id: number, data: UpdateAttributeRequest): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(`/catalog/attributes/${id}`, data)
  },

  async deleteAttribute(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/attributes/${id}`)
  },

  async getAttributeById(id: number): Promise<Attribute> {
    return await apiClient.get<Attribute>(`/catalog/attributes/${id}`)
  },

  async getAttributesByGroup(groupId: number): Promise<Attribute[]> {
    return await apiClient.get<Attribute[]>(`/catalog/attributes/by-group/${groupId}`)
  },
}
