// Espejo del detalle de VentaResponseDto de la API
export interface VentaDetalleResponseDto {
  id: number
  ventaId: number
  productoId: number
  productoNombre: string
  cantidad: number
  precioUnitario: number
  subTotal: number
}
