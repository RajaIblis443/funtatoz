import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import DashboardView from "../views/DashboardView.vue";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/DashboardView.vue'),
        meta: { title: 'Dashboard' }
      },
      {
        path: 'cashier',
        name: 'cashier',
        component: () => import('../views/CashierView.vue'),
        meta: { title: 'Kasir' }
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('../views/ProductsView.vue'),
        meta: { title: 'Kelola Produk' }
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: () => import('../views/TransactionsView.vue'),
        meta: { title: 'Riwayat Transaksi' }
      },
      {
        path: 'finance',
        name: 'finance',
        component: () => import('../views/FinanceView.vue'),
        meta: { title: 'Kelola Keuangan' }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/Register.vue')
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: 'Login' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
