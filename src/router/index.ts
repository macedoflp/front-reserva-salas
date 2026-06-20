import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';

declare module 'vue-router' {
  interface RouteMeta {
    description?: string;
    title: string;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue'),
          meta: {
            description: 'Visão geral da ocupação e agenda das salas.',
            title: 'Dashboard',
          },
        },
        {
          path: 'rooms',
          name: 'rooms',
          component: () => import('@/pages/RoomsPage.vue'),
          meta: {
            description: 'Gestão do catálogo de salas e capacidades.',
            title: 'Salas',
          },
        },
        {
          path: 'reservations',
          name: 'reservations',
          component: () => import('@/pages/ReservationsPage.vue'),
          meta: {
            description: 'Acompanhamento das reservas por sala e status.',
            title: 'Reservas',
          },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue'),
      meta: {
        title: 'Página não encontrada',
      },
    },
  ],
});

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | Reserva de Salas`
    : 'Reserva de Salas';
});

export default router;

