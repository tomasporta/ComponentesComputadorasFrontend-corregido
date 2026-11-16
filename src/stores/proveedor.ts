import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { ProveedorResponseDto } from 'src/models/Proveedor/ProveedorResponseDto';
import type { ProveedorRequestDto } from 'src/models/Proveedor/ProveedorRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';

export const useProveedorStore = defineStore('proveedor', () => {
  const proveedores = ref<ProveedorResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Proveedores */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<ProveedorResponseDto[]>('/Proveedores/All');
      proveedores.value = data;
    } catch (e) {
      proveedores.value = [];
      error.value = mensajeDeError(e, 'Error al obtener los proveedores');
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Proveedores/{id}. Devuelve el registro o null si no existe. */
  async function fetchById(id: number): Promise<ProveedorResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<ProveedorResponseDto>(`/Proveedores/${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Proveedores. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: ProveedorRequestDto) {
    loading.value = true;
    try {
      await api.post('/Proveedores', dto);
      notificarExito('Proveedor creado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Proveedores/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: ProveedorRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Proveedores/${id}`, dto);
      notificarExito('Proveedor actualizado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Proveedores/{id} (se llama borrar porque delete es palabra reservada).
   *  Si falla, lanza un Error con el mensaje de la API (ej: 409 por relaciones). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Proveedores/${id}`);
      notificarExito('Proveedor eliminado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { proveedores, loading, error, fetchAll, fetchById, create, update, borrar };
});
