import { date } from 'quasar';

export function formatoMoneda(valor: number | null | undefined): string {
  return Number(valor ?? 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS' });
}

export function formatoFecha(valor: string | null | undefined): string {
  return valor ? date.formatDate(valor, 'DD/MM/YYYY') : '';
}

/** Fecha de hoy en formato YYYY/MM/DD (el que usa q-date) */
export function hoy(): string {
  return date.formatDate(Date.now(), 'YYYY/MM/DD');
}

/** Convierte "YYYY/MM/DD" (q-date) al formato que espera la API (DateTime) */
export function fechaParaApi(valor: string): string {
  return `${valor.replaceAll('/', '-')}T00:00:00`;
}

/** Convierte la fecha que devuelve la API al formato YYYY/MM/DD de q-date (para editar) */
export function fechaParaForm(valor: string): string {
  return date.formatDate(valor, 'YYYY/MM/DD');
}
