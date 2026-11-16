<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 420px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Crear cuenta</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit">
          <div class="row q-col-gutter-sm">
            <q-input
              v-model="datos.nombres"
              label="Nombres"
              outlined
              class="col-6"
              :rules="[(v: string) => !!v || 'Requerido']"
            />
            <q-input
              v-model="datos.apellidos"
              label="Apellidos"
              outlined
              class="col-6"
              :rules="[(v: string) => !!v || 'Requerido']"
            />
          </div>
          <q-input
            v-model="datos.email"
            label="Email"
            type="email"
            outlined
            :rules="[
              (v: string) => !!v || 'Requerido',
              (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
            ]"
          />
          <q-input
            v-model="datos.password"
            label="Contraseña"
            type="password"
            outlined
            hint="Mínimo 6 caracteres, con mayúscula, minúscula, número y símbolo"
            :rules="[(v: string) => (!!v && v.length >= 6) || 'Mínimo 6 caracteres']"
          />

          <q-banner v-if="auth.error" class="bg-negative text-white q-mt-md" rounded dense>
            {{ auth.error }}
          </q-banner>

          <q-btn
            label="Registrarme"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            :loading="auth.loading"
          />
          <q-btn
            label="Ya tengo cuenta"
            flat
            color="primary"
            class="full-width q-mt-sm"
            to="/login"
            no-caps
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth';
import type { UserRegistroRequestDto } from 'src/models/Identity/User/UserRegistroRequestDto';
import { notificarExito } from 'src/utils/notificar';

const auth = useAuthStore();
const router = useRouter();

// El formulario completa el mismo DTO que viaja a la API
const datos = ref<UserRegistroRequestDto>({ nombres: '', apellidos: '', email: '', password: '' });

onMounted(() => auth.limpiarError());

async function onSubmit() {
  const ok = await auth.register(datos.value);
  if (ok) {
    notificarExito('Usuario creado. Ya podés iniciar sesión.');
    await router.push('/login');
  }
}
</script>
