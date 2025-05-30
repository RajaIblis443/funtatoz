<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Riwayat Transaksi</h1>
      <button 
        @click="refreshTransactions" 
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh
      </button>
    </div>
    
    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Filter</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Mulai
          </label>
          <input 
            type="date" 
            id="startDate" 
            v-model="filters.startDate" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Akhir
          </label>
          <input 
            type="date" 
            id="endDate" 
            v-model="filters.endDate" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label for="kodeBarang" class="block text-sm font-medium text-gray-700 mb-1">
            Kode Barang
          </label>
          <select 
            id="kodeBarang" 
            v-model="filters.kodeBarang" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null">Semua Barang</option>
            <option v-for="kode in uniqueKodeBarang" :key="kode" :value="kode">
              {{ kode }} {{ getProductName(kode) ? `- ${getProductName(kode)}` : '' }}
            </option>
          </select>
        </div>
        
        <div>
          <label for="searchKeyword" class="block text-sm font-medium text-gray-700 mb-1">
            Keyword
          </label>
          <input 
            type="text" 
            id="searchKeyword" 
            v-model="filters.keyword" 
            placeholder="Cari berdasarkan ID..." 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <div class="mt-4 flex justify-end">
        <button 
          @click="resetFilters" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
        >
          Reset
        </button>
        <button 
          @click="applyFilters" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Terapkan Filter
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="transaksiStore.loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="transaksiStore.error" class="bg-red-50 border-l-4 border-danger p-4 rounded shadow-sm mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ transaksiStore.error }}</p>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredTransactions.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada transaksi</h3>
      <p class="text-gray-500">Tidak ada data transaksi yang ditemukan.</p>
    </div>
    
    <!-- Transactions Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Daftar Transaksi
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Total {{ filteredTransactions.length }} transaksi ditemukan
        </p>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Produk
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga Satuan
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(transaction.tanggal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getProductName(transaction.kode_barang) || 'Produk tidak ditemukan' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ transaction.jumlah }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(getProductPrice(transaction.kode_barang)) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatCurrency(getProductPrice(transaction.kode_barang) * transaction.jumlah) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="viewTransactionDetails(transaction)" 
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Detail
                </button>
                <button 
                  @click="deleteTransaction(transaction.id!)" 
                  class="text-red-600 hover:text-red-900"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination if needed -->
      <div v-if="filteredTransactions.length > 10" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Sebelumnya
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Selanjutnya
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Menampilkan <span class="font-medium">1</span> sampai <span class="font-medium">10</span> dari <span class="font-medium">{{ filteredTransactions.length }}</span> transaksi
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Transaction Detail Modal -->
  <div v-if="selectedTransaction" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Detail Transaksi
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          ID: {{ selectedTransaction.id }}
        </p>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
          <p class="text-sm text-gray-900">{{ formatDate(selectedTransaction.tanggal) }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Produk</label>
          <p class="text-sm text-gray-900">{{ getProductName(selectedTransaction.kode_barang) || 'Produk tidak ditemukan' }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
          <p class="text-sm text-gray-900">{{ selectedTransaction.jumlah }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Harga Satuan</label>
          <p class="text-sm text-gray-900">{{ formatCurrency(getProductPrice(selectedTransaction.kode_barang)) }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Total</label>
          <p class="text-sm font-bold text-gray-900">{{ formatCurrency(getProductPrice(selectedTransaction.kode_barang) * selectedTransaction.jumlah) }}</p>
        </div>
      </div>
      <div class="px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
        <button 
          type="button"
          @click="selectedTransaction = null"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full overflow-hidden">
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Konfirmasi Hapus
        </h3>
      </div>
      <div class="px-4 py-5 sm:p-6">
        <p class="text-sm text-gray-500">
          Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </div>
      <div class="px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
        <button 
          type="button"
          @click="confirmDelete"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Hapus
        </button>
        <button 
          type="button"
          @click="cancelDelete"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTransaksiStore } from '../store/transaksi.store';
import { useProdukStore } from '../store/produk.store';
import type { Transaksi } from '../types/transaksi.type';

// Stores
const transaksiStore = useTransaksiStore();
const produkStore = useProdukStore();

// State
const filters = ref({
  startDate: null as string | null,
  endDate: null as string | null,
  kodeBarang: null as number | null,
  keyword: ''
});

const selectedTransaction = ref<Transaksi | null>(null);
const showDeleteConfirm = ref(false);
const transactionToDelete = ref<number | null>(null);

// Computed properties
const filteredTransactions = computed(() => {
  return transaksiStore.filteredTransaksi;
});

const uniqueKodeBarang = computed(() => {
  return transaksiStore.uniqueKodeBarang;
});

// Methods
const refreshTransactions = async () => {
  await transaksiStore.fetchTransaksi();
};

const applyFilters = () => {
  // Convert string dates to Date objects if needed
  let startDate = filters.value.startDate ? new Date(filters.value.startDate) : null;
  let endDate = filters.value.endDate ? new Date(filters.value.endDate) : null;
  
  transaksiStore.$patch({
    filterStartDate: startDate,
    filterEndDate: endDate,
    filterKodeBarang: filters.value.kodeBarang,
    filterKeyword: filters.value.keyword
  });
};

const resetFilters = () => {
  filters.value = {
    startDate: null,
    endDate: null,
    kodeBarang: null,
    keyword: ''
  };
  
  transaksiStore.$patch({
    filterStartDate: null,
    filterEndDate: null,
    filterKodeBarang: null,
    filterKeyword: ''
  });
};

// Fungsi untuk mendapatkan nama produk
const getProductName = (id: number): string => {
  const product = produkStore.getProdukById(id);
  return product ? product.nama_barang : '';
};

const getProductPrice = (id: number): number => {
  const product = produkStore.getProdukById(id);
  return product ? product.harga : 0;
};

const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('id-ID', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const viewTransactionDetails = (transaction: Transaksi) => {
  selectedTransaction.value = transaction;
};

const deleteTransaction = (id: number) => {
  transactionToDelete.value = id;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (transactionToDelete.value) {
    await transaksiStore.deleteTransaksi(transactionToDelete.value.toString());
    cancelDelete();
  }
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  transactionToDelete.value = null;
};

// Load data on mount
onMounted(async () => {
  await Promise.all([
    transaksiStore.fetchTransaksi(),
    produkStore.fetchProduk()
  ]);
});
</script>