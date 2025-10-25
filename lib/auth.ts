// Función para verificar si el token de acceso es válido
export const isTokenValid = (token: string): boolean => {
  if (!token) return false

  try {
    // Decodificar el token JWT para obtener la fecha de expiración
    // Nota: Esta es una implementación simple, en producción deberías usar una biblioteca como jwt-decode
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )

    const { exp } = JSON.parse(jsonPayload)

    // Verificar si el token ha expirado
    return Date.now() < exp * 1000
  } catch (error) {
    console.error("Error al verificar el token:", error)
    return false
  }
}

// Función para refrescar el token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const currentToken = localStorage.getItem("accessToken")
    if (!currentToken) return null

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/API#/"

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accesToken: currentToken }),
    })

    if (!response.ok) {
      throw new Error("Error al refrescar el token")
    }

    const data = await response.json()

    // Guardar el nuevo token
    localStorage.setItem("accessToken", data.accessToken)

    return data.accessToken
  } catch (error) {
    console.error("Error al refrescar el token:", error)
    return null
  }
}

// Función para obtener el token actual, refrescándolo si es necesario
export const getAccessToken = async (): Promise<string | null> => {
  const currentToken = localStorage.getItem("accessToken")

  if (!currentToken) return null

  // Si el token es válido, devolverlo directamente
  if (isTokenValid(currentToken)) {
    return currentToken
  }

  // Si el token ha expirado, intentar refrescarlo
  return await refreshToken()
}
