<template>
  <q-card style="width: 700px; max-width: 95vw">
    <q-card-section class="row items-center">
      <div>
        <div class="text-h6">{{ titulo }}</div>
        <div class="text-caption text-grey-5">{{ subtitulo }}</div>
      </div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-table
      :rows="detalles"
      :columns="columns"
      row-key="id"
      flat
      hide-pagination
      :rows-per-page-options="[0]"
      no-data-label="Sin detalle"
    >
      <template #bottom-row>
        <q-tr>
          <q-td colspan="3" class="text-right text-weight-bold">Total</q-td>
          <q-td class="text-right text-weight-bold">{{ formatoMoneda(total) }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar';
import type { CompraDetalleResponseDto } from 'src/models/Compra/CompraDetalleResponseDto';
import type { VentaDetalleResponseDto } from 'src/models/Venta/VentaDetalleResponseDto';
import { formatoMoneda } from 'src/utils/formato';

// Sirve para mostrar el detalle de una compra o de una venta: recibe los DTOs que devuelve la API
type DetalleResponseDto = CompraDetalleResponseDto | VentaDetalleResponseDto;

defineProps<{
  titulo: string;
  subtitulo: string;
  detalles: DetalleResponseDto[];
  total: number;
}>();

const columns: QTableColumn<DetalleResponseDto>[] = [
  { name: 'productoNombre', label: 'Producto', field: 'productoNombre', align: 'left' },
  { name: 'cantidad', label: 'Cantidad', field: 'cantidad', align: 'center' },
  {
    name: 'precioUnitario',
    label: 'Precio unit.',
    field: 'precioUnitario',
    align: 'right',
    format: formatoMoneda,
  },
  { name: 'subTotal', label: 'Subtotal', field: 'subTotal', align: 'right', format: formatoMoneda },
];
</script>
