<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-semibold text-gray-900">Kelola Keuangan</h1>
      <button 
        @click="openAddModal" 
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
      >
        Tambah Transaksi
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-8">
      <h2 class="text-lg font-medium text-gray-700 mb-4">Filter</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Awal
          </label>
          <input
            type="date"
            v-model="filters.startDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Akhir
          </label>
          <input
            type="date"
            v-model="filters.endDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tipe Transaksi
          </label>
          <select
            v-model="filters.type"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option :value="null">Semua</option>
            <option value="masuk">Pemasukan</option>
            <option value="keluar">Pengeluaran</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Kata Kunci
          </label>
          <input
            type="text"
            v-model="filters.keyword"
            placeholder="Cari keterangan..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button 
          @click="resetFilters" 
          class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-2"
        >
          Reset Filter
        </button>
        <button 
          @click="applyFilters" 
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Terapkan Filter
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-primary">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary bg-opacity-10 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Pemasukan</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(summary.pemasukan) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-danger">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-danger bg-opacity-10 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Pengeluaran</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(summary.pengeluaran) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-primary">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary bg-opacity-10 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Keuntungan</p>
            <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(summary.keuntungan) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="bg-white rounded-lg shadow overflow-x-auto">
      <div v-if="keuanganStore.loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
        <p class="mt-2 text-gray-600">Memuat data...</p>
      </div>
      
      <div v-else-if="filteredTransactions.length === 0" class="p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mt-4">Tidak ada transaksi</h3>
        <p class="text-gray-500 mt-2">Tidak ada transaksi yang ditemukan dengan filter saat ini.</p>
      </div>
      
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipe
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nominal
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Keterangan
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transaction in filteredTransactions" :key="transaction.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(transaction.tanggal) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span :class="{
                'px-2 py-1 rounded-full text-xs font-medium': true,
                'bg-green-100 text-green-800': transaction.tipe === 'masuk',
                'bg-red-100 text-red-800': transaction.tipe === 'keluar'
              }">
                {{ transaction.tipe === 'masuk' ? 'Pemasukan' : 'Pengeluaran' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatCurrency(transaction.nominal) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
              {{ transaction.keterangan }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="openEditModal(transaction)"
                class="text-primary hover:text-primary-hover mr-3"
              >
                 
              </button>
              <button 
                @click="confirmDeleteTransaction(transaction)"
                class="text-danger hover:text-danger-hover"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Add/Edit Transaction Modal -->
    <div v-if="showTransactionModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">{{ isEditing ? 'Edit Transaksi' : 'Tambah Transaksi' }}</h2>
          <button @click="closeTransactionModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitTransactionForm">
          <div class="p-4">
            <div class="mb-4">
              <label for="tanggal" class="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input 
                type="date"
                id="tanggal"
                v-model="transactionForm.tanggal"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipe Transaksi</label>
              <div class="flex space-x-4">
                <div class="flex items-center">
                  <input 
                    type="radio" 
                    id="tipe-masuk" 
                    v-model="transactionForm.tipe" 
                    value="masuk" 
                    name="tipe" 
                    class="mr-2 focus:ring-primary h-4 w-4 text-primary border-gray-300"
                  />
                  <label for="tipe-masuk" class="text-gray-700">Pemasukan</label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="radio" 
                    id="tipe-keluar" 
                    v-model="transactionForm.tipe" 
                    value="keluar" 
                    name="tipe"
                    class="mr-2 focus:ring-danger h-4 w-4 text-danger border-gray-300"
                  />
                  <label for="tipe-keluar" class="text-gray-700">Pengeluaran</label>
                </div>
              </div>
            </div>
            
            <div class="mb-4">
              <label for="nominal" class="block text-sm font-medium text-gray-700 mb-1">Nominal</label>
              <div class="flex rounded-md shadow-sm">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  Rp
                </span>
                <input 
                  type="number"
                  id="nominal"
                  v-model="transactionForm.nominal"
                  min="0"
                  required
                  placeholder="0"
                  class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div class="mb-4">
              <label for="keterangan" class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <textarea 
                id="keterangan"
                v-model="transactionForm.keterangan"
                rows="3"
                placeholder="Masukkan keterangan transaksi"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          
          <div class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-end space-x-2">
            <button 
              type="button" 
              @click="closeTransactionModal"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Batal
            </button>
            <button 
              type="submit"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            Konfirmasi Hapus
          </h3>
        </div>
        <div class="px-4 py-5">
          <p class="text-sm text-gray-500">
            Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div class="px-4 py-4 border-t flex justify-end space-x-2">
          <button 
            type="button"
            @click="cancelDeleteTransaction"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button 
            type="button"
            @click="deleteTransaction"
            class="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menghapus...
            </span>
            <span v-else>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useKeuanganStore } from '../store/keuangan.store';
import type Keuangan from '../types/keuangan.type';

// Store
const keuanganStore = useKeuanganStore();

// State
const filters = ref({
  startDate: null as string | null,
  endDate: null as string | null,
  type: null as 'masuk' | 'keluar' | null,
  keyword: ''
});

// Modal state
const showTransactionModal = ref(false);
const isEditing = ref(false);
const transactionForm = ref<Keuangan>({
  id: 0,
  tanggal: new Date().toISOString().split('T')[0],
  tipe: 'masuk',
  nominal: 0,
  keterangan: ''
});

// Delete confirmation state
const showDeleteConfirm = ref(false);
const transactionToDelete = ref<Keuangan | null>(null);

// Loading states
const isSubmitting = ref(false);
const isDeleting = ref(false);

// Computed properties
const filteredTransactions = computed(() => {
  return keuanganStore.filteredTransaksi;
});

const summary = computed(() => ({
  pemasukan: keuanganStore.totalPemasukan,
  pengeluaran: keuanganStore.totalPengeluaran,
  keuntungan: keuanganStore.keuntungan
}));

// Methods
const refreshData = async () => {
  await keuanganStore.fetchKeuangan();
};

const applyFilters = () => {
  // Convert string dates to Date objects
  let startDate = filters.value.startDate ? new Date(filters.value.startDate) : null;
  let endDate = filters.value.endDate ? new Date(filters.value.endDate) : null;
  
  keuanganStore.setDateFilter(startDate, endDate);
  keuanganStore.setTypeFilter(filters.value.type);
  keuanganStore.setKeywordFilter(filters.value.keyword);
};

const resetFilters = () => {
  filters.value = {
    startDate: null,
    endDate: null,
    type: null,
    keyword: ''
  };
  keuanganStore.clearAllFilters();
};

const openAddModal = () => {
  transactionForm.value = {
    id: 0,
    tanggal: new Date().toISOString().split('T')[0],
    tipe: 'masuk',
    nominal: 0,
    keterangan: ''
  };
  isEditing.value = false;
  showTransactionModal.value = true;
};

const openEditModal = (transaction: Keuangan) => {
  // Create a copy to avoid direct mutation
  transactionForm.value = { ...transaction };
  
  // Format date for input field
  if (typeof transactionForm.value.tanggal === 'string') {
    transactionForm.value.tanggal = new Date(transactionForm.value.tanggal).toISOString().split('T')[0];
  } else {
    transactionForm.value.tanggal = transactionForm.value.tanggal.toISOString().split('T')[0];
  }
  
  isEditing.value = true;
  showTransactionModal.value = true;
};

const closeTransactionModal = () => {
  showTransactionModal.value = false;
};

const submitTransactionForm = async () => {
  try {
    isSubmitting.value = true;
    
    if (isEditing.value) {
      await keuanganStore.updateTransaksi(transactionForm.value);
    } else {
      await keuanganStore.addTransaksi(transactionForm.value);
    }
    
    closeTransactionModal();
  } catch (error) {
    console.error('Error saving transaction:', error);
    alert('Terjadi kesalahan saat menyimpan transaksi');
  } finally {
    isSubmitting.value = false;
  }
};

const confirmDeleteTransaction = (transaction: Keuangan) => {
  transactionToDelete.value = transaction;
  showDeleteConfirm.value = true;
};

const cancelDeleteTransaction = () => {
  transactionToDelete.value = null;
  showDeleteConfirm.value = false;
};

const deleteTransaction = async () => {
  if (!transactionToDelete.value) return;
  
  try {
    isDeleting.value = true;
    await keuanganStore.deleteTransaksi(transactionToDelete.value.id! .toString());
    cancelDeleteTransaction();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    alert('Terjadi kesalahan saat menghapus transaksi');
  } finally {
    isDeleting.value = false;
  }
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

// Load data on mount
onMounted(async () => {
  await refreshData();
});
</script>