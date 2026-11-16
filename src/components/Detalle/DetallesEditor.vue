<template>
  <div>
    <div class="row items-center q-mb-sm">
      <div class="text-subtitle1">Detalle</div>
      <q-space />
      <q-btn
        flat
        dense
        color="primary"
        icon="add"
        label="Agregar producto"
        no-caps
        @click="emit('agregar')"
      />
    </div>

    <div v-if="!detalles.length" class="text-grey-5 q-pa-md text-center bg-grey-9 rounded-borders">
      Agregá al menos un producto
    </div>

    <div v-for="(d, i) in detalles" :key="i" class="row q-col-gutter-sm items-start">
      <!-- productoId vale 0 mientras no se elige; al select se le pasa null para que se vea vacio -->
      <q-select
        :model-value="d.productoId || null"
        :options="productos"
        option-value="id"
        :option-label="(p: ProductoResponseDto) => `${p.codigo} - ${p.nombre}`"
        emit-value
        map-options
        label="Producto"
        outlined
        dense
        class="col-12 col-sm-5"
        :rules="[(v: number | null) => !!v || 'Elegí un producto']"
        @update:model-value="(id: number) => elegirProducto(d, id)"
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.nombre }}</q-item-label>
              <q-item-label caption>
                {{ scope.opt.codigo }} · Stock: {{ scope.opt.stock }} ·
                {{ formatoMoneda(scope.opt.precio) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        v-model.number="d.cantidad"
        type="number"
        label="Cant."
        outlined
        dense
        class="col-4 col-sm-2"
        :rules="[(v: number) => v > 0 || '> 0']"
      />
      <q-input
        v-model.number="d.precioUnitario"
        type="number"
        step="0.01"
        prefix="$"
        label="Precio unit."
        outlined
        dense
        class="col-5 col-sm-3"
        :rules="[(v: number) => v > 0 || '> 0']"
      />
      <div class="col-3 col-sm-2 row items-center no-wrap" style="min-height: 40px">
        <span class="text-weight-medium ellipsis">{{ formatoMoneda(d.cantidad * d.precioUnitario) }}</span>
        <q-space />
        <q-btn flat round dense color="negative" icon="close" @click="detalles.splice(i, 1)" />
      </div>
    </div>

    <q-separator class="q-my-sm" />
    <div class="text-right text-h6">Total: {{ formatoMoneda(total) }}</div>
  </div>
</template>

<script setup lang="ts" generic="T extends CompraDetalleRequestDto | VentaDetalleRequestDto">
import { computed } from 'vue';
import type { CompraDetalleRequestDto } from 'src/models/Compra/CompraDetalleRequestDto';
import type { VentaDetalleRequestDto } from 'src/models/Venta/VentaDetalleRequestDto';
import type { ProductoResponseDto } from 'src/models/Producto/ProductoResponseDto';
import { formatoMoneda } from 'src/utils/formato';

// Editor de lineas de detalle. Es generico: trabaja directamente sobre el array de DTOs del
// padre (CompraDetalleRequestDto[] o VentaDetalleRequestDto[]). Para agregar una linea emite
// 'agregar' y el padre crea el DTO que corresponde (con su compraId / ventaId).
const detalles = defineModel<T[]>({ required: true });

const props = defineProps<{ productos: ProductoResponseDto[] }>();

const emit = defineEmits<{ (e: 'agregar'): void }>();

const total = computed(() =>
  detalles.value.reduce((acc, d) => acc + (d.cantidad || 0) * (d.precioUnitario || 0), 0),
);

// Al elegir el producto se propone su precio de lista
function elegirProducto(detalle: T, id: number) {
  detalle.productoId = id;
  const p = props.productos.find((x) => x.id === id);
  if (p) detalle.precioUnitario = p.precio;
}
</script>
