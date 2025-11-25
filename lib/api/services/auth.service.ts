/**
 * Authentication Service
 * Handles login, logout, and token management
 */

import apiClient from "../client"
import type { LoginRequest, LoginResponse, RefreshTokenRequest } from "../types"

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", credentials)

    // Store the access token
    if (response.accessToken) {
      apiClient.setAccessToken(response.accessToken)
    }

    return response
  },

  /**
   * Refresh access token
   */
  async refreshToken(request: RefreshTokenRequest): Promise<LoginResponse> {
    return await apiClient.post<LoginResponse>("/auth/refresh-token", request)
  },

  /**
   * Logout (clear local token)
   */
  logout(): void {
    apiClient.clearAccessToken()
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.getAccessToken() !== null
  },

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return apiClient.getAccessToken()
  },
}
