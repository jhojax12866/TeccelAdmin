import apiClient from "../client";
import type {
  AttributeGroup,
  CreateAttributeGroupRequest,
  UpdateAttributeGroupRequest,
  Attribute,
  CreateAttributeRequest,
  UpdateAttributeRequest,
  ApiResponseWithId,
  ApiResponse,
} from "../types";

export const attributeService = {
  // Obtener todos los grupos con sus atributos (Tu GET principal)
  async getAllAttributeGroups(): Promise<AttributeGroup[]> {
    return await apiClient.get<AttributeGroup[]>("/catalog/attributes/groups");
  },

  // Crear un grupo nuevo
  async createAttributeGroup(
    data: CreateAttributeGroupRequest
  ): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>(
      "/catalog/attributes/groups",
      data
    );
  },

  // Editar nombre de grupo
  async updateAttributeGroup(id: number, name: string): Promise<ApiResponse> {
    return await apiClient.patch<ApiResponse>(
      `/catalog/attributes/groups/${id}`,
      { name }
    );
  },

  // Crear atributo dentro de un grupo
  async createAttribute(
    data: CreateAttributeRequest
  ): Promise<ApiResponseWithId> {
    return await apiClient.post<ApiResponseWithId>("/catalog/attributes", data);
  },

  // (Opcional) Eliminar atributo si quisieras
  async deleteAttribute(id: number): Promise<ApiResponse> {
    return await apiClient.delete<ApiResponse>(`/catalog/attributes/${id}`);
  },
};
