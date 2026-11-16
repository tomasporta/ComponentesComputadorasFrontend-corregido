// Espejo del detalle de CompraRequestDto de la API (el compraId viaja en 0 al crear)
export interface CompraDetalleRequestDto {
  productoId: number
  compraId: number
  cantidad: number
  precioUnitario: number
}
