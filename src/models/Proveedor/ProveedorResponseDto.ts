import type { ProveedorRequestDto } from './ProveedorRequestDto';

// Espejo de ProveedorResponseDto de la API
export interface ProveedorResponseDto extends ProveedorRequestDto {
  id: number
}
