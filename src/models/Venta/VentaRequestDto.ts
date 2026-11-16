import type { VentaDetalleRequestDto } from './VentaDetalleRequestDto';

// Espejo de VentaRequestDto de la API
// fecha viaja como texto ISO (yyyy-MM-ddT00:00:00); la API lo convierte a DateTime
export interface VentaRequestDto {
  fecha: string
  clienteId: number
  detalles: VentaDetalleRequestDto[]
}
