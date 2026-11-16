import type { EssentialLinkProps } from 'components/EssentialLink.vue';

// Secciones del menu lateral y de la pantalla de inicio
export const secciones: EssentialLinkProps[] = [
  { title: 'Clientes', caption: 'api/Clientes', icon: 'people', link: '/clientes' },
  { title: 'Proveedores', caption: 'api/Proveedores', icon: 'local_shipping', link: '/proveedores' },
  { title: 'Tipos de producto', caption: 'api/TipoProductos', icon: 'category', link: '/tipo-productos' },
  { title: 'Productos', caption: 'api/Productos', icon: 'memory', link: '/productos' },
  { title: 'Socios de negocio', caption: 'api/SocioNegocio', icon: 'handshake', link: '/socios-negocio' },
  { title: 'Ventas', caption: 'api/Ventas', icon: 'point_of_sale', link: '/ventas' },
  { title: 'Compras', caption: 'api/Compras', icon: 'shopping_cart', link: '/compras' },
  { title: 'Detalle de ventas', caption: 'api/VentaDetalles', icon: 'receipt_long', link: '/venta-detalles' },
  { title: 'Detalle de compras', caption: 'api/CompraDetalles', icon: 'inventory_2', link: '/compra-detalles' },
];
