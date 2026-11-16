<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="auth.isAuthenticated"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <router-link to="/" class="text-white" style="text-decoration: none">
            <q-icon name="computer" class="q-mr-sm" />Componentes Computadoras
          </router-link>
        </q-toolbar-title>

        <!-- Con sesion: nombre de usuario y boton para salir. Sin sesion: boton para ingresar -->
        <template v-if="auth.isAuthenticated">
          <q-icon name="person" class="q-mr-xs" />
          <span class="q-mr-md gt-xs">{{ auth.userName }}</span>
          <q-badge v-if="auth.isAdmin" color="grey-7" class="q-mr-md">Admin</q-badge>
          <q-btn flat dense label="Salir" icon="logout" @click="onLogout" />
        </template>
        <q-btn v-else flat dense label="Ingresar" icon="login" to="/login" />
      </q-toolbar>
    </q-header>

    <q-drawer v-if="auth.isAuthenticated" v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <EssentialLink title="Inicio" icon="home" link="/" />
        <q-separator />
        <q-item-label header>Gestión</q-item-label>

        <EssentialLink v-for="link in secciones" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import EssentialLink from 'components/EssentialLink.vue';
import { secciones } from 'components/links';
import { useAuthStore } from 'stores/auth';

const auth = useAuthStore();
const router = useRouter();

async function onLogout() {
  auth.logout();
  await router.push('/login');
}

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
