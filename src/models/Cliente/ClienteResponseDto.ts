import type { ClienteRequestDto } from './ClienteRequestDto';

// Espejo de ClienteResponseDto de la API
export interface ClienteResponseDto extends ClienteRequestDto {
  id: number
}
