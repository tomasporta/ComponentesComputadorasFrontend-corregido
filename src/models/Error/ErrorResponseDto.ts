// Espejo de la respuesta de error de la API (ManejadorDeErrores y los NotFound/Conflict de los controllers)
export interface ErrorResponseDto {
  error: string
  status?: number
}
