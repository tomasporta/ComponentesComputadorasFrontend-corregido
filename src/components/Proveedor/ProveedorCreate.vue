<template>
  <q-card style="min-width: 460px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6">{{ esEdicion ? 'Editar proveedor' : 'Nuevo proveedor' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.razonSocial"
          label="Razón social"
          outlined
          lazy-rules
          :rules="[requerido]"
        />
        <q-input
          v-model="form.cuit"
          label="CUIT (11 dígitos, sin guiones)"
          outlined
          mask="###########"
          lazy-rules
          :rules="[requerido, (v: string) => v.length === 11 || 'El CUIT debe tener 11 dígitos']"
        />
        <q-input
          v-model="form.email"
          label="Email"
          type="email"
          outlined
          lazy-rules
          :rules="[requerido]"
        />
        <q-input v-model="form.telefono" label="Teléfono" outlined lazy-rules :rules="[requerido]" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn label="Guardar" color="primary" :loading="proveedorStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { QForm } from 'quasar';
import { useProveedorStore } from 'stores/proveedor';
import type { ProveedorRequestDto } from 'src/models/Proveedor/ProveedorRequestDto';
import type { ProveedorResponseDto } from 'src/models/Proveedor/ProveedorResponseDto';
import { notificarError } from 'src/utils/notificar';

const emit = defineEmits<{ (e: 'close'): void }>();

// Si llega un registro, el formulario se usa para editarlo
const props = defineProps<{ registro?: ProveedorResponseDto | null }>();
const esEdicion = computed(() => !!props.registro);

const proveedorStore = useProveedorStore();
const formRef = ref<QForm | null>(null);

// El formulario completa el mismo DTO que viaja a la API
const form = ref<ProveedorRequestDto>({
  razonSocial: props.registro?.razonSocial ?? '',
  cuit: props.registro?.cuit ?? '',
  email: props.registro?.email ?? '',
  telefono: props.registro?.telefono ?? '',
});

const requerido = (v: string) => !!v || 'Requerido';

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.registro) {
      await proveedorStore.update(props.registro.id, form.value);
    } else {
      await proveedorStore.create(form.value);
    }
    emit('close');
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo guardar el proveedor');
  }
}
</script>
