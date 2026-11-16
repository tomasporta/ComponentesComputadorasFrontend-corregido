<template>
  <q-card style="min-width: 460px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6">{{ esEdicion ? 'Editar cliente' : 'Nuevo cliente' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <div class="row q-col-gutter-sm">
          <q-input
            v-model="form.nombre"
            label="Nombre"
            outlined
            class="col-6"
            lazy-rules
            :rules="[requerido]"
          />
          <q-input
            v-model="form.apellido"
            label="Apellido"
            outlined
            class="col-6"
            lazy-rules
            :rules="[requerido]"
          />
        </div>
        <q-input
          v-model="form.dni"
          label="DNI"
          outlined
          mask="########"
          lazy-rules
          :rules="[requerido, (v: string) => v.length >= 7 || 'DNI inválido']"
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
      <q-btn label="Guardar" color="primary" :loading="clienteStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { QForm } from 'quasar';
import { useClienteStore } from 'stores/cliente';
import type { ClienteRequestDto } from 'src/models/Cliente/ClienteRequestDto';
import type { ClienteResponseDto } from 'src/models/Cliente/ClienteResponseDto';
import { notificarError } from 'src/utils/notificar';

const emit = defineEmits<{ (e: 'close'): void }>();

// Si llega un registro, el formulario se usa para editarlo
const props = defineProps<{ registro?: ClienteResponseDto | null }>();
const esEdicion = computed(() => !!props.registro);

const clienteStore = useClienteStore();
const formRef = ref<QForm | null>(null);

// El formulario completa el mismo DTO que viaja a la API
const form = ref<ClienteRequestDto>({
  nombre: props.registro?.nombre ?? '',
  apellido: props.registro?.apellido ?? '',
  dni: props.registro?.dni ?? '',
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
      await clienteStore.update(props.registro.id, form.value);
    } else {
      await clienteStore.create(form.value);
    }
    emit('close');
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo guardar el cliente');
  }
}
</script>
