import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { TipoProductoResponseDto } from 'src/models/TipoProducto/TipoProductoResponseDto';
import type { TipoProductoRequestDto } from 'src/models/TipoProducto/TipoProductoRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';

export const useTipoProductoStore = defineStore('tipoProducto', () => {
  const tipos = ref<TipoProductoResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/TipoProductos */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<TipoProductoResponseDto[]>('/TipoProductos/All');
      tipos.value = data;
    } catch (e) {
      tipos.value = [];
      error.value = mensajeDeError(e, 'Error al obtener los tipos de producto');
    } finally {
      loading.value = false;
    }
  }

  /** GET api/TipoProductos/{id}. Devuelve el registro o null si no existe. */
  async function fetchById(id: number): Promise<TipoProductoResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<TipoProductoResponseDto>(`/TipoProductos/${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/TipoProductos. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: TipoProductoRequestDto) {
    loading.value = true;
    try {
      await api.post('/TipoProductos', dto);
      notificarExito('Tipo de producto creado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/TipoProductos/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: TipoProductoRequestDto) {
    loading.value = true;
    try {
      await api.put(`/TipoProductos/${id}`, dto);
      notificarExito('Tipo de producto actualizado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/TipoProductos/{id} (se llama borrar porque delete es palabra reservada).
   *  Si falla, lanza un Error con el mensaje de la API (ej: 409 por relaciones). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/TipoProductos/${id}`);
      notificarExito('Tipo de producto eliminado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { tipos, loading, error, fetchAll, fetchById, create, update, borrar };
});
