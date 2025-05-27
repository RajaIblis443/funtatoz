import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/DashboardView.vue"),
    meta: {
      title: 'Dashboard'
    }
  },
  {
    path: '/cashier',
    name: 'cashier',
    component: () => import('../views/CashierView.vue'),
    meta: {
      title: 'Kasir'
    }
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('../views/ProductsView.vue'),
    meta: {
      title: 'Kelola Produk'
    }
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../views/TransactionsView.vue'),
    meta: {
      title: 'Riwayat Transaksi'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;