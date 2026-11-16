<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Tipos de producto</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nuevo tipo de producto</q-tooltip>
        </q-btn>
        <q-btn flat round icon="refresh" :loading="tipoProductoStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="tipoProductoStore.tipos"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="tipoProductoStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay tipos de producto para mostrar"
          loading-label="Cargando tipos de producto..."
        >
          <!-- Columna de acciones: un boton por cada operacion del ABM -->
          <template #body-cell-acciones="props">
            <q-td class="text-right">
              <q-btn dense flat color="primary" icon="edit" @click="abrirEdicion(props.row)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn dense flat color="negative" icon="delete" @click="confirmarBaja(props.row.id)">
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-banner v-if="tipoProductoStore.error" class="bg-negative text-white" rounded>
        {{ tipoProductoStore.error }}
      </q-banner>
    </q-card>

    <!-- Alta y edicion (si "editando" tiene un registro, el formulario se abre para editar) -->
    <q-dialog v-model="mostrarFormulario" persistent>
      <TipoProductoCreate :registro="editando" @close="cerrarFormulario" />
    </q-dialog>

    <!-- La baja siempre se confirma antes de ejecutarse -->
    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar el tipo de producto. Esta acción no se puede deshacer.</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="eliminar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useTipoProductoStore } from 'stores/tipoProducto';
import type { TipoProductoResponseDto } from 'src/models/TipoProducto/TipoProductoResponseDto';
import TipoProductoCreate from 'src/components/TipoProducto/TipoProductoCreate.vue';
import { notificarError } from 'src/utils/notificar';

const tipoProductoStore = useTipoProductoStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editando = ref<TipoProductoResponseDto | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);

const columns: QTableColumn<TipoProductoResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void tipoProductoStore.fetchAll();
}

function abrirAlta() {
  editando.value = null;
  mostrarFormulario.value = true;
}

function abrirEdicion(row: TipoProductoResponseDto) {
  editando.value = row;
  mostrarFormulario.value = true;
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  recargar();
}

function confirmarBaja(id: number) {
  idABorrar.value = id;
  confirmandoBaja.value = true;
}

async function eliminar() {
  try {
    if (idABorrar.value !== null) {
      await tipoProductoStore.borrar(idABorrar.value);
    }
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo eliminar el tipo de producto');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
});
</script>
