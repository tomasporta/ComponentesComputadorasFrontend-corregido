<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Compras</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nueva compra</q-tooltip>
        </q-btn>
        <q-btn flat round icon="refresh" :loading="compraStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="compraStore.compras"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="compraStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay compras para mostrar"
          loading-label="Cargando compras..."
        >
          <!-- Columna de acciones: un boton por cada operacion del ABM -->
          <template #body-cell-acciones="props">
            <q-td class="text-right">
              <q-btn dense flat color="primary" icon="visibility" @click="verDetalle(props.row)">
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
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

      <q-banner v-if="compraStore.error" class="bg-negative text-white" rounded>
        {{ compraStore.error }}
      </q-banner>
    </q-card>

    <!-- Alta y edicion (si "editando" tiene un registro, el formulario se abre para editar) -->
    <q-dialog v-model="mostrarFormulario" persistent>
      <CompraCreate :registro="editando" @close="cerrarFormulario" />
    </q-dialog>

    <!-- Detalle de la compra seleccionada -->
    <q-dialog v-model="mostrarDetalle">
      <DetallesDialog
        :titulo="`Compra #${seleccionada?.id ?? ''}`"
        :subtitulo="seleccionada ? `${seleccionada.proveedorNombre} · ${formatoFecha(seleccionada.fecha)}` : ''"
        :detalles="seleccionada?.detalles ?? []"
        :total="seleccionada?.total ?? 0"
      />
    </q-dialog>

    <!-- La baja siempre se confirma antes de ejecutarse -->
    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar la compra. Esta acción no se puede deshacer.</q-card-section>
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
import { useCompraStore } from 'stores/compra';
import type { CompraResponseDto } from 'src/models/Compra/CompraResponseDto';
import CompraCreate from 'src/components/Compra/CompraCreate.vue';
import DetallesDialog from 'src/components/Detalle/DetallesDialog.vue';
import { formatoFecha, formatoMoneda } from 'src/utils/formato';
import { notificarError } from 'src/utils/notificar';

const compraStore = useCompraStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editando = ref<CompraResponseDto | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);
const mostrarDetalle = ref(false);
const seleccionada = ref<CompraResponseDto | null>(null);

const columns: QTableColumn<CompraResponseDto>[] = [
  { name: 'id', label: 'N°', field: 'id', align: 'left', sortable: true },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left', sortable: true, format: formatoFecha },
  { name: 'proveedorNombre', label: 'Proveedor', field: 'proveedorNombre', align: 'left', sortable: true },
  { name: 'items', label: 'Ítems', field: (row) => row.detalles?.length ?? 0, align: 'center' },
  { name: 'total', label: 'Total', field: 'total', align: 'right', sortable: true, format: formatoMoneda },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void compraStore.fetchAll();
}

function abrirAlta() {
  editando.value = null;
  mostrarFormulario.value = true;
}

function abrirEdicion(row: CompraResponseDto) {
  editando.value = row;
  mostrarFormulario.value = true;
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  recargar();
}

function verDetalle(row: CompraResponseDto) {
  seleccionada.value = row;
  mostrarDetalle.value = true;
}

function confirmarBaja(id: number) {
  idABorrar.value = id;
  confirmandoBaja.value = true;
}

async function eliminar() {
  try {
    if (idABorrar.value !== null) {
      await compraStore.borrar(idABorrar.value);
    }
  } catch (e) {
    notificarError(e instanceof Error ? e.message : 'No se pudo eliminar la compra');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
});
</script>
