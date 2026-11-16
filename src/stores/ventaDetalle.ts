import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { VentaDetalleResponseDto } from 'src/models/Venta/VentaDetalleResponseDto';
import type { VentaDetalleRequestDto } from 'src/models/Venta/VentaDetalleRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';
import { useProductoStore } from './producto';

export const useVentaDetalleStore = defineStore('ventaDetalle', () => {
  const detalles = ref<VentaDetalleResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  // Compras y ventas mueven el stock: despues de guardar o borrar se recargan
  // los productos para que el stock nuevo se vea en todas las pantallas
  const productoStore = useProductoStore();

  /** GET api/VentaDetalles/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<VentaDetalleResponseDto[]>('/VentaDetalles/All');
      detalles.value = data;
    } catch (e) {
      detalles.value = [];
      error.value = mensajeDeError(e, 'Error al obtener los detalles de ventas');
    } finally {
      loading.value = false;
    }
  }

  /** POST api/VentaDetalles. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: VentaDetalleRequestDto) {
    loading.value = true;
    try {
      await api.post('/VentaDetalles', dto);
      notificarExito('Detalle de venta creado');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/VentaDetalles/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: VentaDetalleRequestDto) {
    loading.value = true;
    try {
      await api.put(`/VentaDetalles/${id}`, dto);
      notificarExito('Detalle de venta actualizado');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/VentaDetalles/{id} (se llama borrar porque delete es palabra reservada). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/VentaDetalles/${id}`);
      notificarExito('Detalle de venta eliminado');
      await productoStore.fetchAll();
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { detalles, loading, error, fetchAll, create, update, borrar };
});
