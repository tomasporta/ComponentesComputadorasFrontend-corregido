<template>
  <q-card style="width: 800px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6">{{ esEdicion ? `Editar venta #${props.registro?.id}` : 'Nueva venta' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <div class="row q-col-gutter-sm">
          <!-- clienteId vale 0 mientras no se elige; al select se le pasa null para que se vea vacio -->
          <q-select
            :model-value="form.clienteId || null"
            :options="clienteStore.clientes"
            option-value="id"
            :option-label="(c: ClienteResponseDto) => `${c.apellido}, ${c.nombre} (DNI ${c.dni})`"
            emit-value
            map-options
            label="Cliente"
            outlined
            class="col-12 col-sm-8"
            :loading="clienteStore.loading"
            lazy-rules
            :rules="[(v: number | null) => !!v || 'Elegí un cliente']"
            @update:model-value="(id: number) => (form.clienteId = id)"
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
      <q-btn label="Guardar" color="primary" :loading="ventaStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useVentaStore } from 'stores/venta';
import { useClienteStore } from 'stores/cliente';
import { useProductoStore } from 'stores/producto';
import DetallesEditor from 'src/components/Detalle/DetallesEditor.vue';
import type { VentaRequestDto } from 'src/models/Venta/VentaRequestDto';
import type { VentaResponseDto } from 'src/models/Venta/VentaResponseDto';
import type { VentaDetalleRequestDto } from 'src/models/Venta/VentaDetalleRequestDto';
import type { VentaDetalleResponseDto } from 'src/models/Venta/VentaDetalleResponseDto';
import type { ClienteResponseDto } from 'src/models/Cliente/ClienteResponseDto';
import { fechaParaApi, fechaParaForm, hoy } from 'src/utils/formato';
import { notificarError } from 'src/utils/notificar';

const emit = defineEmits<{ (e: 'close'): void }>();

// Si llega un registro, el formulario se usa para editarlo
const props = defineProps<{ registro?: VentaResponseDto | null }>();
const esEdicion = computed(() => !!props.registro);

const ventaStore = useVentaStore();
const clienteStore = useClienteStore();
const productoStore = useProductoStore();
const formRef = ref<QForm | null>(null);

// El formulario ES el VentaRequestDto que viaja a la API.
// La fecha se edita como YYYY/MM/DD (formato de q-date) y se convierte al guardar.
const form = ref<VentaRequestDto>({
  fecha: props.registro ? fechaParaForm(props.registro.fecha) : hoy(),
  clienteId: props.registro?.clienteId ?? 0,
  detalles:
    props.registro?.detalles.map(detalleParaEditar) ?? [],
});

// Convierte un detalle que devolvio la API (Response) en el DTO que se envia (Request)
function detalleParaEditar(d: VentaDetalleResponseDto): VentaDetalleRequestDto {
  const detalle: VentaDetalleRequestDto = {
    productoId: d.productoId,
    ventaId: d.ventaId,
    cantidad: d.cantidad,
    precioUnitario: d.precioUnitario,
  };
  return detalle;
}

// Al abrir el formulario se refrescan los combos
onMounted(() => {
  void clienteStore.fetchAll();
  void productoStore.fetchAll();
});

// Cada linea nueva es un VentaDetalleRequestDto
function agregarDetalle() {
  const nuevo: VentaDetalleRequestDto = {
    productoId: 0,
    ventaId: props.registro?.id ?? 0,
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
    const dto: VentaRequestDto = { ...form.value, fecha: fechaParaApi(form.value.fecha) };
    if (props.registro) {
      await ventaStore.update(props.registro.id, dto);
    } else {
      await ventaStore.create(dto);
    }
    emit('close');
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo guardar la venta');
  }
}
</script>
