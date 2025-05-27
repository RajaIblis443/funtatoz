<template>
  <div>
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div class="flex-1 w-full">
        <input 
          type="text" 
          placeholder="Cari produk..." 
          v-model="searchQuery"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
        />
      </div>

      <div class="flex gap-2">
        <button 
          @click="refreshProducts" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
        
        <button 
          @click="openAddProductModal" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Tambah Produk
        </button>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="produkStore.loading" class="flex items-center justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="produkStore.error" class="bg-danger bg-opacity-10 border-l-4 border-danger p-4 rounded shadow-sm mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ produkStore.error }}</p>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredProducts.length === 0" class="bg-white rounded-lg shadow p-12 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Tidak ada produk</h3>
      <p class="text-gray-500 mb-6">Tambahkan produk baru untuk mulai mengelola inventaris</p>
      <button 
        @click="openAddProductModal" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Tambah Produk
      </button>
    </div>
    
    <!-- Products Table -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              nama_barang Produk
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ product.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ product.nama_barang }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatCurrency(product.harga) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="openEditProductModal(product)"
                class="text-primary hover:text-primary-hover mr-3"
              >
                Edit
              </button>
              <button 
                @click="confirmDeleteProduct(product)"
                class="text-danger hover:text-danger-hover"
              >
                Hapus
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Product Form Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">{{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}</h2>
          <button @click="closeProductModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="submitProductForm" class="p-4">
          <div class="space-y-4">
            <div>
              <label for="product-name" class="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
              <input 
                id="product-name"
                type="text" 
                v-model="productForm.nama_barang" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label for="product-price" class="block text-sm font-medium text-gray-700 mb-1">Harga</label>
              <input 
                id="product-price"
                type="number" 
                v-model.number="productForm.harga" 
                required
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div class="flex justify-end pt-4 mt-4 border-t">
            <button 
              type="button"
              @click="closeProductModal" 
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
            >
              {{ isEditing ? 'Update' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="bg-red-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900">Hapus Produk</h3>
          </div>
          
          <p class="mb-4 text-gray-500">
            Apakah Anda yakin ingin menghapus produk "{{ productToDelete?.nama_barang }}"? 
            Tindakan ini tidak dapat dibatalkan.
          </p>
          
          <div class="flex justify-end gap-2">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              @click="deleteProduct"
              class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProdukStore } from '../store/produk.store';
import type { Produk } from '../types/produk.type';

// Initialize store
const produkStore = useProdukStore();

// State
const searchQuery = ref('');
const showProductModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const productForm = ref<Produk>({
  id: 0,
  nama_barang: '',
  harga: 0
});
const productToDelete = ref<Produk | null>(null);

// Load products on mount
onMounted(async () => {
  await produkStore.fetchProduk();
});

// Computed properties
const filteredProducts = computed(() => {
  if (!searchQuery.value) {
    return produkStore.data;
  }
  
  const query = searchQuery.value.toLowerCase();
  return produkStore.data.filter(
    product => 
      product.nama_barang.toLowerCase().includes(query) || 
      product.id.toString().includes(query) ||
      product.harga.toString().includes(query)
  );
});

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const refreshProducts = async (): Promise<void> => {
  await produkStore.fetchProduk();
};

const openAddProductModal = (): void => {
  productForm.value = {
    id: 0,
    nama_barang: '',
    harga: 0
  };
  isEditing.value = false;
  showProductModal.value = true;
};

const openEditProductModal = (product: Produk): void => {
  productForm.value = { ...product };
  isEditing.value = true;
  showProductModal.value = true;
};

const closeProductModal = (): void => {
  showProductModal.value = false;
};

const submitProductForm = async (): Promise<void> => {
  try {
    if (isEditing.value) {
      await produkStore.updateProduk(productForm.value);
    } else {
      await produkStore.addProduk(productForm.value);
    }
    closeProductModal();
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Terjadi kesalahan saat menyimpan produk');
  }
};

const confirmDeleteProduct = (product: Produk): void => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const deleteProduct = async (): Promise<void> => {
  if (!productToDelete.value) return;
  
  try {
    await produkStore.deleteProduk(productToDelete.value.id.toString());
    showDeleteModal.value = false;
    productToDelete.value = null;
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Terjadi kesalahan saat menghapus produk');
  }
};
</script>