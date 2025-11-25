/**
 * API Client Configuration
 * Base HTTP client with interceptors for authentication and error handling
 */

interface ApiError {
  message: string
  statusCode?: number
  error?: string
}

interface RequestConfig {
  method: string
  headers: Record<string, string>
  body?: string
}

class ApiClient {
  private baseURL: string
  private accessToken: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL

    // Load token from localStorage if available
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken")
    }
  }

  setAccessToken(token: string) {
    this.accessToken = token
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token)
    }
  }

  clearAccessToken() {
    this.accessToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken")
    }
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestConfig = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      } as Record<string, string>,
    }

    // Add authorization header if token exists
    if (this.accessToken) {
      config.headers["Authorization"] = `Bearer ${this.accessToken}`
    }

    // Add body if present
    if (options.body) {
      config.body = options.body as string
    }

    try {
      const response = await fetch(url, config)

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Error desconocido",
          statusCode: response.status,
        }))

        throw {
          message: errorData.message || "Error en la petición",
          statusCode: response.status,
          error: errorData.error,
        } as ApiError
      }

      // Return parsed JSON
      return await response.json()
    } catch (error) {
      // Re-throw API errors
      if ((error as ApiError).statusCode) {
        throw error
      }

      // Handle network errors
      throw {
        message: "Error de conexión con el servidor",
        statusCode: 0,
      } as ApiError
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient("http://localhost:3001")

export default apiClient
