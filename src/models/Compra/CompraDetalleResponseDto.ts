// Espejo del detalle de CompraResponseDto de la API
export interface CompraDetalleResponseDto {
  id: number
  compraId: number
  productoId: number
  productoNombre: string
  cantidad: number
  precioUnitario: number
  subTotal: number
}
