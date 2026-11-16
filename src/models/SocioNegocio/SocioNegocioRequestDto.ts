import type { TipoSocio } from './TipoSocio';

// Espejo de SocioNegocioRequestDto de la API
// Solo se completa el Id que corresponde al tipo elegido; el otro viaja en null (int? en la API)
export interface SocioNegocioRequestDto {
  nombre: string
  tipo: TipoSocio
  clienteId: number | null
  proveedorId: number | null
}
