<template>
  <q-card style="min-width: 460px; max-width: 95vw">
    <q-card-section>
      <div class="text-h6">{{ esEdicion ? 'Editar tipo de producto' : 'Nuevo tipo de producto' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input v-model="form.nombre" label="Nombre" outlined lazy-rules :rules="[requerido]" />
        <q-input
          v-model="form.descripcion"
          label="Descripción"
          type="textarea"
          autogrow
          outlined
          lazy-rules
          :rules="[requerido]"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="emit('close')" />
      <q-btn label="Guardar" color="primary" :loading="tipoProductoStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { QForm } from 'quasar';
import { useTipoProductoStore } from 'stores/tipoProducto';
import type { TipoProductoRequestDto } from 'src/models/TipoProducto/TipoProductoRequestDto';
import type { TipoProductoResponseDto } from 'src/models/TipoProducto/TipoProductoResponseDto';
import { notificarError } from 'src/utils/notificar';

const emit = defineEmits<{ (e: 'close'): void }>();

// Si llega un registro, el formulario se usa para editarlo
const props = defineProps<{ registro?: TipoProductoResponseDto | null }>();
const esEdicion = computed(() => !!props.registro);

const tipoProductoStore = useTipoProductoStore();
const formRef = ref<QForm | null>(null);

// El formulario completa el mismo DTO que viaja a la API
const form = ref<TipoProductoRequestDto>({
  nombre: props.registro?.nombre ?? '',
  descripcion: props.registro?.descripcion ?? '',
});

const requerido = (v: string) => !!v || 'Requerido';

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.registro) {
      await tipoProductoStore.update(props.registro.id, form.value);
    } else {
      await tipoProductoStore.create(form.value);
    }
    emit('close');
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo guardar el tipo de producto');
  }
}
</script>
