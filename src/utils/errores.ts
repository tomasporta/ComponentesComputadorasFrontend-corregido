import { isAxiosError } from 'axios';
import type { ErrorResponseDto } from 'src/models/Error/ErrorResponseDto';
import type { ValidationErrorResponseDto } from 'src/models/Error/ValidationErrorResponseDto';

function esErrorResponse(data: unknown): data is ErrorResponseDto {
  return typeof data === 'object' && data !== null && typeof (data as ErrorResponseDto).error === 'string';
}

function esValidationError(data: unknown): data is ValidationErrorResponseDto {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as ValidationErrorResponseDto).errors === 'object'
  );
}

/**
 * Convierte un error de axios en un mensaje legible.
 * La API devuelve:
 *  - ErrorResponseDto            { error: "..." }            -> errores de negocio, 404, 409, 500
 *  - ValidationErrorResponseDto  { errors: { Campo: [...] } } -> validaciones de los DTOs (400)
 *  - string plano                                             -> algunos Ok/BadRequest simples
 */
export function mensajeDeError(e: unknown, porDefecto = 'Ocurrió un error inesperado'): string {
  if (!isAxiosError(e)) {
    return e instanceof Error && e.message ? e.message : porDefecto;
  }

  if (!e.response) {
    return e.request ? 'No se pudo conectar con la API. ¿Está levantada?' : porDefecto;
  }

  const status = e.response.status;
  const data: unknown = e.response.data;

  // El proxy de Quasar responde 5xx sin cuerpo cuando la API .NET no esta levantada
  const sinCuerpo = data === '' || data === undefined || data === null;
  if (status >= 500 && sinCuerpo) {
    return 'No se pudo conectar con la API. Verificá que ComponentesComputadoras.WebApi esté corriendo (perfil https, puerto 7136).';
  }

  if (esErrorResponse(data)) return data.error;

  if (esValidationError(data)) {
    return Object.values(data.errors).flat().join(' ');
  }

  if (typeof data === 'string' && data.trim()) return data;

  if (status === 401) return 'No autorizado. Iniciá sesión nuevamente.';
  if (status === 403) return 'No tenés permisos para esta acción.';
  if (status === 404) return 'No se encontró el recurso.';

  return `${porDefecto} (Error ${status})`;
}
