import type { ClienteResponseDto } from '../Cliente/ClienteResponseDto';
import type { ProveedorResponseDto } from '../Proveedor/ProveedorResponseDto';
import type { TipoSocio } from './TipoSocio';

// Espejo de SocioNegocioResponseDto de la API
export interface SocioNegocioResponseDto {
  id: number
  nombre: string
  tipo: TipoSocio
  clienteId: number | null
  proveedorId: number | null
  cliente: ClienteResponseDto | null
  proveedor: ProveedorResponseDto | null
}
