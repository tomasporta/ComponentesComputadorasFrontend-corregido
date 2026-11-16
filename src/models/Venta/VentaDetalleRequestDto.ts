// Espejo del detalle de VentaRequestDto de la API (el ventaId viaja en 0 al crear)
export interface VentaDetalleRequestDto {
  productoId: number
  ventaId: number
  cantidad: number
  precioUnitario: number
}
