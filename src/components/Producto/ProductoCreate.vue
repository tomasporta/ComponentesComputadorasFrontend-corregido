<template>
  <q-card style="min-width: 560px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6">{{ esEdicion ? 'Editar producto' : 'Nuevo producto' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <div class="row q-col-gutter-sm">
          <q-input
            v-model="form.nombre"
            label="Nombre"
            outlined
            class="col-8"
            lazy-rules
            :rules="[requerido]"
          />
          <q-input
            v-model="form.codigo"
            label="Código"
            outlined
            class="col-4"
            lazy-rules
            :rules="[requerido]"
          />
        </div>
        <q-input
          v-model="form.descripcion"
          label="Descripción"
          type="textarea"
          autogrow
          outlined
          lazy-rules
          :rules="[requerido]"
        />
        <div class="row q-col-gutter-sm">
          <q-input
            v-model.number="form.precio"
            label="Precio"
            type="number"
            step="0.01"
            prefix="$"
            outlined
            class="col-6"
            lazy-rules
            :rules="[(v: number) => v > 0 || 'Debe ser mayor a 0']"
          />
          <q-input
            v-model.number="form.stock"
            label="Stock"
            type="number"
            outlined
            class="col-6"
            lazy-rules
            :rules="[(v: number) => v >= 0 || 'No puede ser negativo']"
          />
        </div>
        <!-- Los Id valen 0 mientras no se eligen; a los select se les pasa null para que se vean vacios -->
        <q-select
          :model-value="form.tipoProductoId || null"
          :options="tipoProductoStore.tipos"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          label="Tipo de producto"
          outlined
          :loading="tipoProductoStore.loading"
          lazy-rules
          :rules="[requeridoId]"
          no-error-icon
          @update:model-value="(id: number) => (form.tipoProductoId = id)"
        >
          <template #no-option>
            <q-item
              ><q-item-section class="text-grey">Primero cargá un tipo de producto</q-item-section></q-item
            >
          </template>
        </q-select>
        <q-select
          :model-value="form.proveedorId || null"
          :options="proveedorStore.proveedores"
          option-value="id"
          option-label="razonSocial"
          emit-value
          map-options
          label="Proveedor"
          outlined
          :loading="proveedorStore.loading"
          lazy-rules
          :rules="[requeridoId]"
          no-error-icon
          @update:model-value="(id: number) => (form.proveedorId = id)"
        >
          <template #no-option>
            <q-item><q-item-section class="text-grey">Primero cargá un proveedor</q-item-section></q-item>
          </template>
        </q-select>
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn label="Guardar" color="primary" :loading="productoStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useProductoStore } from 'stores/producto';
import { useTipoProductoStore } from 'stores/tipoProducto';
import { useProveedorStore } from 'stores/proveedor';
import type { ProductoRequestDto } from 'src/models/Producto/ProductoRequestDto';
import type { ProductoResponseDto } from 'src/models/Producto/ProductoResponseDto';
import { notificarError } from 'src/utils/notificar';

const emit = defineEmits<{ (e: 'close'): void }>();

// Si llega un registro, el formulario se usa para editarlo
const props = defineProps<{ registro?: ProductoResponseDto | null }>();
const esEdicion = computed(() => !!props.registro);

const productoStore = useProductoStore();
const tipoProductoStore = useTipoProductoStore();
const proveedorStore = useProveedorStore();
const formRef = ref<QForm | null>(null);

// El formulario ES el ProductoRequestDto que viaja a la API
const form = ref<ProductoRequestDto>({
  nombre: props.registro?.nombre ?? '',
  codigo: props.registro?.codigo ?? '',
  descripcion: props.registro?.descripcion ?? '',
  precio: props.registro?.precio ?? 0,
  stock: props.registro?.stock ?? 0,
  tipoProductoId: props.registro?.tipoProductoId ?? 0,
  proveedorId: props.registro?.proveedorId ?? 0,
});

const requerido = (v: string) => !!v || 'Requerido';
const requeridoId = (v: number | null) => !!v || 'Requerido';

// Al abrir el alta se refrescan los combos
onMounted(() => {
  void tipoProductoStore.fetchAll();
  void proveedorStore.fetchAll();
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.registro) {
      await productoStore.update(props.registro.id, form.value);
    } else {
      await productoStore.create(form.value);
    }
    emit('close');
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo guardar el producto');
  }
}
</script>
