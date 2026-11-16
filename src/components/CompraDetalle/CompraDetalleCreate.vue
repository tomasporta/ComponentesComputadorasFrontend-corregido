<template>
  <q-card style="min-width: 520px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6">{{ esEdicion ? 'Editar detalle de compra' : 'Nuevo detalle de compra' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <!-- Los Id valen 0 mientras no se eligen; a los select se les pasa null para que se vean vacios -->
        <q-select
          :model-value="form.compraId || null"
          :options="compraStore.compras"
          option-value="id"
          :option-label="(c: CompraResponseDto) => `Compra #${c.id} · ${c.proveedorNombre} · ${formatoFecha(c.fecha)}`"
          emit-value
          map-options
          label="Compra"
          outlined
          :loading="compraStore.loading"
          lazy-rules
          :rules="[(v: number | null) => !!v || 'Elegí una compra']"
          no-error-icon
          @update:model-value="(id: number) => (form.compraId = id)"
        >
          <template #no-option>
            <q-item><q-item-section class="text-grey">Primero registrá una compra</q-item-section></q-item>
          </template>
        </q-select>

        <q-select
          :model-value="form.productoId || null"
          :options="productoStore.productos"
          option-value="id"
          :option-label="(p: ProductoResponseDto) => `${p.codigo} - ${p.nombre}`"
          emit-value
          map-options
          label="Producto"
          outlined
          :loading="productoStore.loading"
          lazy-rules
          :rules="[(v: number | null) => !!v || 'Elegí un producto']"
          no-error-icon
          @update:model-value="elegirProducto"
        />

        <div class="row q-col-gutter-sm">
          <q-input
            v-model.number="form.cantidad"
            label="Cantidad"
            type="number"
            outlined
            class="col-6"
            lazy-rules
            :rules="[(v: number) => v > 0 || 'Debe ser mayor a 0']"
          />
          <q-input
            v-model.number="form.precioUnitario"
            label="Precio unitario"
            type="number"
            step="0.01"
            prefix="$"
            outlined
            class="col-6"
            lazy-rules
            :rules="[(v: number) => v > 0 || 'Debe ser mayor a 0']"
          />
        </div>
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn label="Guardar" color="primary" :loading="detalleStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useCompraDetalleStore } from 'stores/compraDetalle';
import { useCompraStore } from 'stores/compra';
import { useProductoStore } from 'stores/producto';
import type { CompraDetalleRequestDto } from 'src/models/Compra/CompraDetalleRequestDto';
import type { CompraDetalleResponseDto } from 'src/models/Compra/CompraDetalleResponseDto';
import type { CompraResponseDto } from 'src/models/Compra/CompraResponseDto';
import type { ProductoResponseDto } from 'src/models/Producto/ProductoResponseDto';
import { formatoFecha } from 'src/utils/formato';
import { notificarError } from 'src/utils/notificar';

const emit = defineEmits<{ (e: 'close'): void }>();

// Si llega un registro, el formulario se usa para editarlo
const props = defineProps<{ registro?: CompraDetalleResponseDto | null }>();
const esEdicion = computed(() => !!props.registro);

const detalleStore = useCompraDetalleStore();
const compraStore = useCompraStore();
const productoStore = useProductoStore();
const formRef = ref<QForm | null>(null);

// El formulario ES el CompraDetalleRequestDto que viaja a la API
const form = ref<CompraDetalleRequestDto>({
  compraId: props.registro?.compraId ?? 0,
  productoId: props.registro?.productoId ?? 0,
  cantidad: props.registro?.cantidad ?? 1,
  precioUnitario: props.registro?.precioUnitario ?? 0,
});

// Al abrir el formulario se refrescan los combos
onMounted(() => {
  void compraStore.fetchAll();
  void productoStore.fetchAll();
});

// Al elegir el producto se propone su precio de lista
function elegirProducto(id: number) {
  form.value.productoId = id;
  const p = productoStore.productos.find((x) => x.id === id);
  if (p) form.value.precioUnitario = p.precio;
}

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.registro) {
      await detalleStore.update(props.registro.id, form.value);
    } else {
      await detalleStore.create(form.value);
    }
    emit('close');
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo guardar el detalle de compra');
  }
}
</script>
