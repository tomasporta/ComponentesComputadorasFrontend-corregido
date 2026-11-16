import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { VentaResponseDto } from 'src/models/Venta/VentaResponseDto';
import type { VentaRequestDto } from 'src/models/Venta/VentaRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';
import { useProductoStore } from './producto';

export const useVentaStore = defineStore('venta', () => {
  const ventas = ref<VentaResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  // Compras y ventas mueven el stock: despues de guardar o borrar se recargan
  // los productos para que el stock nuevo se vea en todas las pantallas
  const productoStore = useProductoStore();

  /** GET api/Ventas/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<VentaResponseDto[]>('/Ventas/All');
      ventas.value = data;
    } catch (e) {
      ventas.value = [];
      error.value = mensajeDeError(e, 'Error al obtener las ventas');
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Ventas/{id}. Devuelve el registro o null si no existe. */
  async function fetchById(id: number): Promise<VentaResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<VentaResponseDto>(`/Ventas/${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Ventas. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: VentaRequestDto) {
    loading.value = true;
    try {
      await api.post('/Ventas', dto);
      notificarExito('Venta registrada');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Ventas/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: VentaRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Ventas/${id}`, dto);
      notificarExito('Venta actualizada');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Ventas/{id} (se llama borrar porque delete es palabra reservada).
   *  Si falla, lanza un Error con el mensaje de la API (ej: 409 por relaciones). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Ventas/${id}`);
      notificarExito('Venta eliminada');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { ventas, loading, error, fetchAll, fetchById, create, update, borrar };
});
