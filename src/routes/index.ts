// src/routes/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import DashboardView from "../views/DashboardView.vue";
import { getAuthCookie } from "../utils/util";

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../components/AppLayout.vue'),
    meta: { requiresAuth: true }, // Semua child routes memerlukan auth
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

// Route Guard - Proteksi untuk route yang memerlukan login
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!getAuthCookie(); // Cek apakah user sudah login
  
  // Jika route memerlukan auth dan user belum login
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('🔒 Akses ditolak - belum login');
    next('/login'); // Redirect ke halaman login
    return;
  }
  
  // Jika user sudah login tapi mengakses halaman login
  if (to.name === 'Login' && isAuthenticated) {
    console.log('✅ Sudah login - redirect ke dashboard');
    next('/'); // Redirect ke dashboard
    return;
  }
  
  // Lanjutkan ke route yang dituju
  next();
});

export default router