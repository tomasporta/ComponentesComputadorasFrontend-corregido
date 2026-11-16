import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { CompraResponseDto } from 'src/models/Compra/CompraResponseDto';
import type { CompraRequestDto } from 'src/models/Compra/CompraRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';
import { useProductoStore } from './producto';

export const useCompraStore = defineStore('compra', () => {
  const compras = ref<CompraResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  // Compras y ventas mueven el stock: despues de guardar o borrar se recargan
  // los productos para que el stock nuevo se vea en todas las pantallas
  const productoStore = useProductoStore();

  /** GET api/Compras/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<CompraResponseDto[]>('/Compras/All');
      compras.value = data;
    } catch (e) {
      compras.value = [];
      error.value = mensajeDeError(e, 'Error al obtener las compras');
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Compras/{id}. Devuelve el registro o null si no existe. */
  async function fetchById(id: number): Promise<CompraResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<CompraResponseDto>(`/Compras/${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Compras. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: CompraRequestDto) {
    loading.value = true;
    try {
      await api.post('/Compras', dto);
      notificarExito('Compra registrada');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Compras/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: CompraRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Compras/${id}`, dto);
      notificarExito('Compra actualizada');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Compras/{id} (se llama borrar porque delete es palabra reservada).
   *  Si falla, lanza un Error con el mensaje de la API (ej: 409 por relaciones). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Compras/${id}`);
      notificarExito('Compra eliminada');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { compras, loading, error, fetchAll, fetchById, create, update, borrar };
});
