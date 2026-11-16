<template>
  <q-card style="min-width: 520px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6">{{ esEdicion ? 'Editar socio de negocio' : 'Nuevo socio de negocio' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-btn-toggle
          v-model="form.tipo"
          spread
          no-caps
          toggle-color="primary"
          class="q-mb-md"
          :options="opcionesTipo"
          @update:model-value="cambiarTipo"
        />

        <q-select
          v-if="form.tipo === 'Cliente'"
          v-model="form.clienteId"
          :options="clienteStore.clientes"
          option-value="id"
          :option-label="(c: ClienteResponseDto) => `${c.apellido}, ${c.nombre} (DNI ${c.dni})`"
          emit-value
          map-options
          label="Cliente"
          outlined
          :loading="clienteStore.loading"
          lazy-rules
          :rules="[requeridoId]"
          @update:model-value="completarDesdeCliente"
        />
        <q-select
          v-else
          v-model="form.proveedorId"
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
          @update:model-value="completarDesdeProveedor"
        />

        <q-input v-model="form.nombre" label="Nombre" outlined lazy-rules :rules="[requerido]" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn label="Guardar" color="primary" :loading="socioStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QBtnToggleProps, QForm } from 'quasar';
import { useSocioNegocioStore } from 'stores/socioNegocio';
import { useClienteStore } from 'stores/cliente';
import { useProveedorStore } from 'stores/proveedor';
import type { SocioNegocioRequestDto } from 'src/models/SocioNegocio/SocioNegocioRequestDto';
import type { SocioNegocioResponseDto } from 'src/models/SocioNegocio/SocioNegocioResponseDto';
import type { TipoSocio } from 'src/models/SocioNegocio/TipoSocio';
import type { ClienteResponseDto } from 'src/models/Cliente/ClienteResponseDto';
import { notificarError } from 'src/utils/notificar';

const emit = defineEmits<{ (e: 'close'): void }>();

// Si llega un registro, el formulario se usa para editarlo
const props = defineProps<{ registro?: SocioNegocioResponseDto | null }>();
const esEdicion = computed(() => !!props.registro);

const socioStore = useSocioNegocioStore();
const clienteStore = useClienteStore();
const proveedorStore = useProveedorStore();
const formRef = ref<QForm | null>(null);

// Opciones del toggle con el tipo de Quasar; el value es un TipoSocio
const opcionesTipo: QBtnToggleProps['options'] = [
  { label: 'Cliente', value: 'Cliente' satisfies TipoSocio, icon: 'person' },
  { label: 'Proveedor', value: 'Proveedor' satisfies TipoSocio, icon: 'local_shipping' },
];

// El formulario ES el SocioNegocioRequestDto que viaja a la API
const form = ref<SocioNegocioRequestDto>({
  tipo: props.registro?.tipo ?? 'Cliente',
  clienteId: props.registro?.clienteId ?? null,
  proveedorId: props.registro?.proveedorId ?? null,
  nombre: props.registro?.nombre ?? '',
});

const requerido = (v: string) => !!v || 'Requerido';
const requeridoId = (v: number | null) => !!v || 'Requerido';

// Al abrir el formulario se refrescan los combos
onMounted(() => {
  void clienteStore.fetchAll();
  void proveedorStore.fetchAll();
});

// Al cambiar el tipo solo queda el Id que corresponde
function cambiarTipo() {
  form.value.clienteId = null;
  form.value.proveedorId = null;
}

// Propone el nombre del socio al elegir el cliente / proveedor
function completarDesdeCliente(id: number | null) {
  const c = clienteStore.clientes.find((x) => x.id === id);
  if (c) form.value.nombre = `${c.nombre} ${c.apellido}`;
}

function completarDesdeProveedor(id: number | null) {
  const p = proveedorStore.proveedores.find((x) => x.id === id);
  if (p) form.value.nombre = p.razonSocial;
}

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.registro) {
      await socioStore.update(props.registro.id, form.value);
    } else {
      await socioStore.create(form.value);
    }
    emit('close');
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo guardar el socio de negocio');
  }
}
</script>
