<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md" style="width: 380px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Iniciar sesión</div>
        <div class="text-caption text-grey-5">Usuario de prueba: admin@email.com / Admin123!</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit">
          <q-input
            v-model="credenciales.email"
            label="Email"
            type="email"
            outlined
            autofocus
            :rules="[(v: string) => !!v || 'Ingresá el email']"
          />
          <q-input
            v-model="credenciales.password"
            label="Contraseña"
            :type="verPassword ? 'text' : 'password'"
            outlined
            class="q-mt-sm"
            :rules="[(v: string) => !!v || 'Ingresá la contraseña']"
          >
            <template #append>
              <q-icon
                :name="verPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="verPassword = !verPassword"
              />
            </template>
          </q-input>

          <q-banner v-if="auth.error" class="bg-negative text-white q-mt-sm" rounded dense>
            {{ auth.error }}
          </q-banner>

          <q-btn
            label="Ingresar"
            type="submit"
            color="primary"
            class="full-width q-mt-md"
            :loading="auth.loading"
          />
          <q-btn
            label="Crear una cuenta"
            flat
            color="primary"
            class="full-width q-mt-sm"
            to="/registro"
            no-caps
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth';
import type { LoginUserRequestDto } from 'src/models/Login/LoginUserRequestDto';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

// El formulario completa el mismo DTO que viaja a la API
const credenciales = ref<LoginUserRequestDto>({ email: '', password: '' });
const verPassword = ref(false);

onMounted(() => auth.limpiarError());

async function onSubmit() {
  const ok = await auth.login(credenciales.value);
  if (ok) {
    // Si el guard lo mando al login, vuelve a la pagina que queria abrir
    const destino = typeof route.query.redirect === 'string' ? route.query.redirect : '/';
    await router.push(destino);
  }
}
</script>
