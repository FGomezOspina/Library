import { MenuItem } from '@models/layout/menu.model';

export const dataModules: MenuItem[] = [
  {
    id: 3,
    label: 'Libros',
    icon: 'bx-user-circle',
    link: '/books',
  },
  {
    id: 4,
    label: 'Carrito',
    icon: 'bx-cart',
    link: '/books/cart',
  },
  {
    id: 3,
    label: 'Ordenes',
    icon: 'bx-receipt',
    link: '/books/orders',
  },
];
