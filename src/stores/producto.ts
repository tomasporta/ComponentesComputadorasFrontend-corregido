import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';
import type { ProductoResponseDto } from 'src/models/Producto/ProductoResponseDto';
import type { ProductoRequestDto } from 'src/models/Producto/ProductoRequestDto';
import { mensajeDeError } from 'src/utils/errores';
import { notificarExito } from 'src/utils/notificar';

export const useProductoStore = defineStore('producto', () => {
  const productos = ref<ProductoResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Productos/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<ProductoResponseDto[]>('/Productos/All');
      productos.value = data;
    } catch (e) {
      productos.value = [];
      error.value = mensajeDeError(e, 'Error al obtener los productos');
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Productos/{id}. Devuelve el registro o null si no existe. */
  async function fetchById(id: number): Promise<ProductoResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<ProductoResponseDto>(`/Productos/${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Productos. Si falla, lanza un Error con el mensaje de la API. */
  async function create(dto: ProductoRequestDto) {
    loading.value = true;
    try {
      await api.post('/Productos', dto);
      notificarExito('Producto creado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo guardar'));
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Productos/{id}. Si falla, lanza un Error con el mensaje de la API. */
  async function update(id: number, dto: ProductoRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Productos/${id}`, dto);
      notificarExito('Producto actualizado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo actualizar'));
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Productos/{id} (se llama borrar porque delete es palabra reservada).
   *  Si falla, lanza un Error con el mensaje de la API (ej: 409 por relaciones). */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Productos/${id}`);
      notificarExito('Producto eliminado');
    } catch (e) {
      throw new Error(mensajeDeError(e, 'No se pudo borrar'));
    } finally {
      loading.value = false;
    }
  }

  return { productos, loading, error, fetchAll, fetchById, create, update, borrar };
});
