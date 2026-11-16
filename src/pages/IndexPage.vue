<template>
  <q-page class="q-pa-lg">
    <!-- Sin sesion: invitacion a ingresar -->
    <div v-if="!auth.isAuthenticated" class="flex flex-center" style="min-height: 70vh">
      <q-card class="q-pa-md text-center" style="width: 420px; max-width: 90vw">
        <q-card-section>
          <q-icon name="computer" size="64px" color="primary" />
          <div class="text-h5 q-mt-sm">Componentes Computadoras</div>
        </q-card-section>
        <q-card-section>
          <div class="text-subtitle1">Iniciá sesión para gestionar el sistema</div>
          <q-btn label="Ingresar" icon="login" color="primary" class="q-mt-md" to="/login" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Con sesion: accesos a cada seccion -->
    <template v-else>
      <div class="text-h5 q-mb-xs">Hola, {{ auth.userName }}</div>
      <div class="text-subtitle2 text-grey-5 q-mb-lg">¿Qué querés gestionar?</div>

      <div class="row q-col-gutter-md">
        <div v-for="s in secciones" :key="s.link" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="cursor-pointer card-seccion" @click="void router.push(s.link ?? '/')">
            <q-card-section class="row items-center no-wrap">
              <q-avatar color="primary" text-color="white" :icon="s.icon" />
              <div class="q-ml-md">
                <div class="text-subtitle1">{{ s.title }}</div>
                <div class="text-caption text-grey-5">{{ s.caption }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth';
import { secciones } from 'components/links';

const auth = useAuthStore();
const router = useRouter();
</script>

<style scoped>
.card-seccion {
  transition: transform 0.15s;
}
.card-seccion:hover {
  transform: translateY(-3px);
}
</style>
