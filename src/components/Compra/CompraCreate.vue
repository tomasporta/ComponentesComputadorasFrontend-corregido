<template>
  <q-card style="width: 800px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6">{{ esEdicion ? `Editar compra #${props.registro?.id}` : 'Nueva compra' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <div class="row q-col-gutter-sm">
          <!-- proveedorId vale 0 mientras no se elige; al select se le pasa null para que se vea vacio -->
          <q-select
            :model-value="form.proveedorId || null"
            :options="proveedorStore.proveedores"
            option-value="id"
            :option-label="(p: ProveedorResponseDto) => `${p.razonSocial} (CUIT ${p.cuit})`"
            emit-value
            map-options
            label="Proveedor"
            outlined
            class="col-12 col-sm-8"
            :loading="proveedorStore.loading"
            lazy-rules
            :rules="[(v: number | null) => !!v || 'Elegí un proveedor']"
            @update:model-value="(id: number) => (form.proveedorId = id)"
          />
          <q-input
            v-model="form.fecha"
            label="Fecha"
            outlined
            mask="####/##/##"
            class="col-12 col-sm-4"
            lazy-rules
            :rules="[(v: string) => !!v || 'Requerido']"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.fecha" today-btn>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <DetallesEditor
          v-model="form.detalles"
          :productos="productoStore.productos"
          @agregar="agregarDetalle"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn label="Guardar" color="primary" :loading="compraStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useCompraStore } from 'stores/compra';
import { useProveedorStore } from 'stores/proveedor';
import { useProductoStore } from 'stores/producto';
import DetallesEditor from 'src/components/Detalle/DetallesEditor.vue';
import type { CompraRequestDto } from 'src/models/Compra/CompraRequestDto';
import type { CompraResponseDto } from 'src/models/Compra/CompraResponseDto';
import type { CompraDetalleRequestDto } from 'src/models/Compra/CompraDetalleRequestDto';
import type { CompraDetalleResponseDto } from 'src/models/Compra/CompraDetalleResponseDto';
import type { ProveedorResponseDto } from 'src/models/Proveedor/ProveedorResponseDto';
import { fechaParaApi, fechaParaForm, hoy } from 'src/utils/formato';
import { notificarError } from 'src/utils/notificar';

const emit = defineEmits<{ (e: 'close'): void }>();

// Si llega un registro, el formulario se usa para editarlo
const props = defineProps<{ registro?: CompraResponseDto | null }>();
const esEdicion = computed(() => !!props.registro);

const compraStore = useCompraStore();
const proveedorStore = useProveedorStore();
const productoStore = useProductoStore();
const formRef = ref<QForm | null>(null);

// El formulario ES el CompraRequestDto que viaja a la API.
// La fecha se edita como YYYY/MM/DD (formato de q-date) y se convierte al guardar.
const form = ref<CompraRequestDto>({
  fecha: props.registro ? fechaParaForm(props.registro.fecha) : hoy(),
  proveedorId: props.registro?.proveedorId ?? 0,
  detalles:
    props.registro?.detalles.map(detalleParaEditar) ?? [],
});

// Convierte un detalle que devolvio la API (Response) en el DTO que se envia (Request)
function detalleParaEditar(d: CompraDetalleResponseDto): CompraDetalleRequestDto {
  const detalle: CompraDetalleRequestDto = {
    productoId: d.productoId,
    compraId: d.compraId,
    cantidad: d.cantidad,
    precioUnitario: d.precioUnitario,
  };
  return detalle;
}

// Al abrir el formulario se refrescan los combos
onMounted(() => {
  void proveedorStore.fetchAll();
  void productoStore.fetchAll();
});

// Cada linea nueva es un CompraDetalleRequestDto
function agregarDetalle() {
  const nuevo: CompraDetalleRequestDto = {
    productoId: 0,
    compraId: props.registro?.id ?? 0,
    cantidad: 1,
    precioUnitario: 0,
  };
  form.value.detalles.push(nuevo);
}

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  if (!form.value.detalles.length) {
    notificarError('Agregá al menos un producto');
    return;
  }
  try {
    const dto: CompraRequestDto = { ...form.value, fecha: fechaParaApi(form.value.fecha) };
    if (props.registro) {
      await compraStore.update(props.registro.id, dto);
    } else {
      await compraStore.create(dto);
    }
    emit('close');
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo guardar la compra');
  }
}
</script>
