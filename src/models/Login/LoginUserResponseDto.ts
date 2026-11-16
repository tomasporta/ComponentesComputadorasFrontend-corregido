// Espejo de LoginUserResponseDto de la API (Application/Dtos/Login)
// Los roles y la expiracion salen de los claims del token
export interface LoginUserResponseDto {
  token: string
  userName: string | null
  mail: string | null
  login: boolean
}
