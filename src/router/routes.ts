import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/login', component: () => import('pages/Auth/LoginPage.vue'), meta: { soloInvitado: true } },
      { path: '/registro', component: () => import('pages/Auth/RegisterPage.vue'), meta: { soloInvitado: true } },
      // requiresAuth: el guard del router (router/index.ts) exige sesion iniciada
      { path: '/clientes', component: () => import('pages/Cliente/ClientesPage.vue'), meta: { requiresAuth: true } },
      { path: '/proveedores', component: () => import('pages/Proveedor/ProveedoresPage.vue'), meta: { requiresAuth: true } },
      { path: '/tipo-productos', component: () => import('pages/TipoProducto/TipoProductosPage.vue'), meta: { requiresAuth: true } },
      { path: '/productos', component: () => import('pages/Producto/ProductosPage.vue'), meta: { requiresAuth: true } },
      { path: '/socios-negocio', component: () => import('pages/SocioNegocio/SociosNegocioPage.vue'), meta: { requiresAuth: true } },
      { path: '/ventas', component: () => import('pages/Venta/VentasPage.vue'), meta: { requiresAuth: true } },
      { path: '/compras', component: () => import('pages/Compra/ComprasPage.vue'), meta: { requiresAuth: true } },
      { path: '/venta-detalles', component: () => import('pages/VentaDetalle/VentaDetallesPage.vue'), meta: { requiresAuth: true } },
      { path: '/compra-detalles', component: () => import('pages/CompraDetalle/CompraDetallesPage.vue'), meta: { requiresAuth: true } },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
