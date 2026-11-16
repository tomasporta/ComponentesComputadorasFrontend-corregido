import type { CompraDetalleResponseDto } from './CompraDetalleResponseDto';

// Espejo de CompraResponseDto de la API
export interface CompraResponseDto {
  id: number
  fecha: string
  proveedorId: number
  proveedorNombre: string
  detalles: CompraDetalleResponseDto[]
  total: number
}
