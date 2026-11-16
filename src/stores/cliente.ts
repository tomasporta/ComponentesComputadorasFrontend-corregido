import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { ClienteResponseDto } from 'src/models/Cliente/ClienteResponseDto';
import type { ClienteRequestDto } from 'src/models/Cliente/ClienteRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';

export const useClienteStore = defineStore('cliente', () => {
  const clientes = ref<ClienteResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Clientes/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<ClienteResponseDto[]>('/Clientes/All');
      clientes.value = data;
    } catch (e) {
      clientes.value = [];
      error.value = mensajeDeError(e, 'Error al obtener los clientes');
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Clientes/{id}. Devuelve el registro o null si no existe. */
  async function fetchById(id: number): Promise<ClienteResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<ClienteResponseDto>(`/Clientes/${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Clientes. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: ClienteRequestDto) {
    loading.value = true;
    try {
      await api.post('/Clientes', dto);
      notificarExito('Cliente creado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Clientes/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: ClienteRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Clientes/${id}`, dto);
      notificarExito('Cliente actualizado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Clientes/{id} (se llama borrar porque delete es palabra reservada).
   *  Si falla, lanza un Error con el mensaje de la API (ej: 409 por relaciones). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Clientes/${id}`);
      notificarExito('Cliente eliminado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { clientes, loading, error, fetchAll, fetchById, create, update, borrar };
});
