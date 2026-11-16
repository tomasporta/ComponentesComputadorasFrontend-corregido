import type { CompraDetalleRequestDto } from './CompraDetalleRequestDto';

// Espejo de CompraRequestDto de la API
// fecha viaja como texto ISO (yyyy-MM-ddT00:00:00); la API lo convierte a DateTime
export interface CompraRequestDto {
  fecha: string
  proveedorId: number
  detalles: CompraDetalleRequestDto[]
}
