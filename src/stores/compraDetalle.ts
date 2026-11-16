import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { CompraDetalleResponseDto } from 'src/models/Compra/CompraDetalleResponseDto';
import type { CompraDetalleRequestDto } from 'src/models/Compra/CompraDetalleRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';
import { useProductoStore } from './producto';

export const useCompraDetalleStore = defineStore('compraDetalle', () => {
  const detalles = ref<CompraDetalleResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  // Compras y ventas mueven el stock: despues de guardar o borrar se recargan
  // los productos para que el stock nuevo se vea en todas las pantallas
  const productoStore = useProductoStore();

  /** GET api/CompraDetalles/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<CompraDetalleResponseDto[]>('/CompraDetalles/All');
      detalles.value = data;
    } catch (e) {
      detalles.value = [];
      error.value = mensajeDeError(e, 'Error al obtener los detalles de compras');
    } finally {
      loading.value = false;
    }
  }

  /** POST api/CompraDetalles. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: CompraDetalleRequestDto) {
    loading.value = true;
    try {
      await api.post('/CompraDetalles', dto);
      notificarExito('Detalle de compra creado');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/CompraDetalles/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: CompraDetalleRequestDto) {
    loading.value = true;
    try {
      await api.put(`/CompraDetalles/${id}`, dto);
      notificarExito('Detalle de compra actualizado');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/CompraDetalles/{id} (se llama borrar porque delete es palabra reservada). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/CompraDetalles/${id}`);
      notificarExito('Detalle de compra eliminado');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { detalles, loading, error, fetchAll, create, update, borrar };
});
