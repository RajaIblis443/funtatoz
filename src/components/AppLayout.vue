<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar Overlay for Mobile -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSidebarOpen" 
        class="fixed inset-0 bg-black bg-opacity-30 lg:hidden z-20"
        @click="isSidebarOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out"
      :class="isSidebarOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="p-4 flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center mb-8">
          <div class="h-20 w-18 rounded-md bg-none flex items-center justify-center text-white mr-3">
            <img src="../assets/logo final.png" alt="Logo">
          </img>
          </div>
          <h1 class="text-2xl font-bold text-black">Batik Giriloyo</h1>
        </div>

        <!-- Navigation Menu -->
        <nav class="space-y-1 flex-grow">
          <router-link to="/" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700" 
            :class="{ 'bg-blue-50 text-blue-700 border-r-4 border-blue-500': route.path === '/' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            <span>Dashboard</span>
          </router-link>

          <router-link to="/cashier" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700" 
            :class="{ 'bg-blue-50 text-blue-700 border-r-4 border-blue-500': route.path === '/cashier' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
            </svg>
            <span>Kasir</span>
          </router-link>

          <router-link to="/products" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700" 
            :class="{ 'bg-blue-50 text-blue-700 border-r-4 border-blue-500': route.path === '/products' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            <span>Produk</span>
          </router-link>

          <router-link to="/transactions" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700" 
            :class="{ 'bg-blue-50 text-blue-700 border-r-4 border-blue-500': route.path === '/transactions' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
            <span>Transaksi</span>
          </router-link>

          <router-link to="/finance" class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-700" 
            :class="{ 'bg-blue-50 text-blue-700 border-r-4 border-blue-500': route.path === '/finance' }">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z" clip-rule="evenodd" />
            </svg>
            <span>Keuangan</span>
          </router-link>
          <ButtonLogout class="mt-4"/>
        </nav>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-64 transition-all duration-300">
      <!-- Top Navigation -->
      <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex items-center justify-between h-16 px-4">
          <button @click="toggleSidebar" class="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 class="text-lg font-semibold text-gray-900">{{ currentPageTitle }}</h1>
          <div class="w-6"></div> <!-- Balance placeholder for alignment -->
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 md:p-6">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth.store';
import ButtonLogout from '@/components/ui/ButtonLogout.vue';
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const isSidebarOpen = ref(false);
const route = useRoute();
const router = useRouter();

const handleLogout = useAuthStore(); 

// Close sidebar on route change for mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false;
});

// Handle navigation event
const handleNavigation = () => {
  // Pastikan sidebar tertutup pada navigasi di perangkat mobile
  isSidebarOpen.value = false;
};

// Register navigation event listener
onMounted(() => {
  router.beforeEach((_to, _from, next) => {
    handleNavigation();
    next();
  });
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const currentPageTitle = computed(() => {
  return route.meta.title || 'Dashboard';
});
</script>

<style>
/* No @apply styles needed - all styles are directly in the template */
</style>