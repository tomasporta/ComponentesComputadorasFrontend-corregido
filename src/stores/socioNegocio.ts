import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { SocioNegocioResponseDto } from 'src/models/SocioNegocio/SocioNegocioResponseDto';
import type { SocioNegocioRequestDto } from 'src/models/SocioNegocio/SocioNegocioRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';

export const useSocioNegocioStore = defineStore('socioNegocio', () => {
  const socios = ref<SocioNegocioResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/SocioNegocio/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<SocioNegocioResponseDto[]>('/SocioNegocio/All');
      socios.value = data;
    } catch (e) {
      socios.value = [];
      error.value = mensajeDeError(e, 'Error al obtener los socios de negocio');
    } finally {
      loading.value = false;
    }
  }

  /** GET api/SocioNegocio/{id}. Devuelve el registro o null si no existe. */
  async function fetchById(id: number): Promise<SocioNegocioResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<SocioNegocioResponseDto>(`/SocioNegocio/${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/SocioNegocio. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: SocioNegocioRequestDto) {
    loading.value = true;
    try {
      await api.post('/SocioNegocio', dto);
      notificarExito('Socio de negocio creado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/SocioNegocio/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: SocioNegocioRequestDto) {
    loading.value = true;
    try {
      await api.put(`/SocioNegocio/${id}`, dto);
      notificarExito('Socio de negocio actualizado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/SocioNegocio/{id} (se llama borrar porque delete es palabra reservada).
   *  Si falla, lanza un Error con el mensaje de la API (ej: 409 por relaciones). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/SocioNegocio/${id}`);
      notificarExito('Socio de negocio eliminado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { socios, loading, error, fetchAll, fetchById, create, update, borrar };
});
