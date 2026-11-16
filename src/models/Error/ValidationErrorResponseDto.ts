// Espejo de la respuesta 400 de ASP.NET cuando falla la validacion de un DTO (ModelState)
// errors: { "Campo": ["mensaje 1", "mensaje 2"] }
export interface ValidationErrorResponseDto {
  title: string
  status: number
  errors: Record<string, string[]>
}
