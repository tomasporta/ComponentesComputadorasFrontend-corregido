import type { TipoProductoRequestDto } from './TipoProductoRequestDto';

// Espejo de TipoProductoResponseDto de la API
export interface TipoProductoResponseDto extends TipoProductoRequestDto {
  id: number
}
