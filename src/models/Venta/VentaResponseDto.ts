import type { VentaDetalleResponseDto } from './VentaDetalleResponseDto';

// Espejo de VentaResponseDto de la API
export interface VentaResponseDto {
  id: number
  fecha: string
  clienteId: number
  clienteNombre: string
  detalles: VentaDetalleResponseDto[]
  total: number
}
