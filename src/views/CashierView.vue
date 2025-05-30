<template>
  <div class="h-[calc(100vh-4rem)]">
    <div class="grid grid-cols-1 lg:grid-cols-3 h-full gap-6">
      <!-- Left side - Product selection -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <!-- Search Bar -->
        <div class="p-4 border-b">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cari produk..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
          />
        </div>

        <!-- Products Grid -->
        <div class="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div v-if="produkStore.loading" class="flex items-center justify-center h-full">
            <div class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent">
              
            </div>
          </div>
          
          <div v-else-if="filteredProducts.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Produk tidak ditemukan</p>
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <TransitionGroup 
              name="list"
              tag="div"
              class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-44"
            >
              <div 
                v-for="product in filteredProducts" 
                :key="product.id" 
                class="bg-white w-40 rounded-lg shadow border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-all duration-200 transform hover:scale-105 hover:border-primary"
                @click="addToCart(product)"
              >
                <h3 class="font-medium text-gray-900 mb-1 truncate">{{ product.nama_barang ?? 'kosong' }}</h3>
                <p class="text-primary font-semibold">{{ formatCurrency(product.harga) }}</p>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>

      <!-- Right side - Cart -->
      <div class="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold text-gray-900">Keranjang Belanja</h2>
        </div>
        
        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div v-if="cart.length === 0" class="flex flex-col items-center justify-center h-full text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p>Keranjang kosong</p>
          </div>

          <div v-else class="space-y-3">
            <TransitionGroup 
              name="list"
              tag="div"
              class="space-y-3"
            >
              <div 
                v-for="(item, index) in cart" 
                :key="item.id" 
                class="flex items-center py-2 border-b hover:bg-gray-50 transform transition-all duration-200"
              >
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ item.name ?? 'Null' }}</p>
                  <p class="text-gray-500 text-sm">{{ formatCurrency(item.price) }} x {{ item.quantity }}</p>
                </div>
                
                <div class="flex items-center space-x-2">
                  <div class="flex items-center space-x-1">
                    <button @click="decreaseQuantity(index)" class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                      </svg>
                    </button>
                    
                    <span class="w-8 text-center">{{ item.quantity }}</span>
                    
                    <button @click="increaseQuantity(index)" class="w-6 h-6 rounded-full bg-primary bg-opacity-20 text-primary hover:bg-opacity-30 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  
                  <p class="font-medium text-gray-900 w-20 text-right">{{ formatCurrency(item.price * item.quantity) }}</p>
                  
                  <button @click="removeItem(index)" class="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
        
        <!-- Cart Summary -->
        <div class="p-4 border-t bg-gray-50">
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Jumlah Item:</span>
            <span class="font-medium">{{ totalItems }}</span>
          </div>
          <div class="flex justify-between mb-4">
            <span class="text-gray-600">Total:</span>
            <span class="font-bold text-lg">{{ formatCurrency(totalAmount) }}</span>
          </div>
          
          <div class="flex space-x-2">
            <button @click="clearCart" class="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Bersihkan
            </button>
            <button 
              @click="processPayment" 
              class="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-hover disabled:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="cart.length === 0"
            >
              Bayar
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Pembayaran</h2>
          <button @click="showPaymentModal = false" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-4">
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600">Total Pembayaran:</span>
              <span class="font-bold text-lg">{{ formatCurrency(totalAmount) }}</span>
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">Jumlah Tunai</label>
              <input 
                type="number" 
                v-model.number="cashAmount" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                @input="calculateChange"
              />
            </div>
            
            <div class="flex justify-between items-center py-2 bg-gray-50 rounded-md px-3">
              <span class="text-gray-600">Kembalian:</span>
              <span class="font-semibold text-lg" :class="{'text-red-500': changeAmount < 0, 'text-green-500': changeAmount >= 0}">
                {{ formatCurrency(changeAmount) }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end p-4 border-t">
          <button 
            @click="showPaymentModal = false" 
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-50"
            :disabled="isProcessingPayment"
          >
            Batal
          </button>
          <button 
            @click="confirmPayment" 
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center"
            :disabled="!isPaymentValid || isProcessingPayment"
          >
            <div v-if="isProcessingPayment" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
            {{ isProcessingPayment ? 'Memproses...' : 'Konfirmasi' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Receipt Modal -->
    <div v-if="showReceiptModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div class="flex justify-between items-center p-4 border-b">
          <h2 class="text-lg font-semibold">Struk Pembelian</h2>
          <button @click="closeReceipt" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="p-4" id="receipt-content">
          <div class="text-center mb-4">
            <h3 class="text-xl font-bold">FUNTATOZ</h3>
            <p class="text-gray-600 text-sm">{{ formatDate(new Date()) }}</p>
          </div>
          
          <div class="mb-4">
            <div class="grid grid-cols-12 border-b pb-2 mb-2 font-semibold text-sm">
              <div class="col-span-4">Produk</div>
              <div class="col-span-2 text-center">Jumlah</div>
              <div class="col-span-3 text-right">Harga</div>
              <div class="col-span-3 text-right">Total</div>
            </div>
            
            <div v-for="(item, index) in cart" :key="index" class="grid grid-cols-12 py-1 text-sm">
              <div class="col-span-4">{{ item.name }}</div>
              <div class="col-span-2 text-center">{{ item.quantity }}</div>
              <div class="col-span-3 text-right">{{ formatCurrency(item.price) }}</div>
              <div class="col-span-3 text-right font-medium">{{ formatCurrency(item.price * item.quantity) }}</div>
            </div>
          </div>
          
          <div class="border-t pt-3 space-y-1">
            <div class="flex justify-between">
              <span>Total:</span>
              <span class="font-bold">{{ formatCurrency(totalAmount) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Tunai:</span>
              <span>{{ formatCurrency(cashAmount) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Kembalian:</span>
              <span>{{ formatCurrency(changeAmount) }}</span>
            </div>
          </div>
          
          <div class="text-center mt-6 pt-4 border-t text-gray-600 text-sm">
            <p>Terima kasih telah berbelanja</p>
            <p>di FUNTATOZ</p>
          </div>
        </div>
        
        <div class="flex justify-end p-4 border-t">
          <button 
            @click="printReceipt" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md mr-2 hover:bg-blue-700"
          >
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Cetak
            </span>
          </button>
          <button 
            @click="closeReceipt" 
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProdukStore } from '../store/produk.store';
import { useTransaksiStore } from '../store/transaksi.store';
import { useKeuanganStore } from '../store/keuangan.store';

// Initialize stores
const produkStore = useProdukStore();
const transaksiStore = useTransaksiStore();
const keuanganStore = useKeuanganStore();

// State
const searchQuery = ref('');
const cart = ref<{id: number; name: string; price: number; quantity: number}[]>([]);
const showPaymentModal = ref(false);
const showReceiptModal = ref(false);
const cashAmount = ref(0);
const changeAmount = ref(0);
const isProcessingPayment = ref(false); // State baru

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
    product => product.nama_barang.toLowerCase().includes(query) || 
    product.id!.toString().includes(query)
  );
});

const totalItems = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0);
});

const totalAmount = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const isPaymentValid = computed(() => {
  return Number(cashAmount.value) >= totalAmount.value;
});

// Methods
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', { 
    dateStyle: 'medium', 
    timeStyle: 'short' 
  }).format(date);
};

const addToCart = (product: { id?: number; nama_barang: string; harga: number }) => {

  const existingIndex = cart.value.findIndex(item => item.id === product.id);
  
  if (existingIndex >= 0) {
    // Increment jumlah jika sudah ada
    cart.value[existingIndex].quantity++;
  } else {
    cart.value.push({
      id: product.id!,
      name: product.nama_barang,
      price: product.harga,
      quantity: 1
    });
  }
};

const increaseQuantity = (index: number): void => {
  cart.value[index].quantity += 1;
};

const decreaseQuantity = (index: number): void => {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity -= 1;
  } else {
    removeItem(index);
  }
};

const removeItem = (index: number): void => {
  cart.value.splice(index, 1);
};

const clearCart = (): void => {
  cart.value = [];
};
const processPayment = (): void => {
  cashAmount.value = totalAmount.value;
  changeAmount.value = 0;
  showPaymentModal.value = true;
};

const calculateChange = (): void => {
  changeAmount.value = Math.max(0, Number(cashAmount.value) - totalAmount.value);
};

const confirmPayment = async (): Promise<void> => {
  try {
    // Aktifkan loading
    isProcessingPayment.value = true;
    
    // 1. Create transactions for each product
    for (const item of cart.value) {
      await transaksiStore.addTransaksi({
        id: 0, // Will be generated by the service
        tanggal: new Date().toISOString(),
        kode_barang: item.id,
        jumlah: item.quantity
      });
    }
    
    // 2. Create a keuangan entry for the sale
    await keuanganStore.addTransaksi({
      id: 0, // Will be generated by the service
      tanggal: new Date().toISOString(),
      tipe: 'masuk',
      nominal: totalAmount.value,
      keterangan: `Penjualan ${totalItems.value} item`
    });
    
    // 3. Show receipt
    showPaymentModal.value = false;
    showReceiptModal.value = true;
  } catch (error) {
    console.error('Error processing payment:', error);
    alert('Terjadi kesalahan saat memproses pembayaran');
  } finally {
    // Nonaktifkan loading setelah selesai atau jika terjadi error
    isProcessingPayment.value = false;
  }
};

const printReceipt = (): void => {
  const printContent = document.getElementById('receipt-content');
  const originalContents = document.body.innerHTML;

  if (printContent) {
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContents;
  }
};

const closeReceipt = (): void => {
  showReceiptModal.value = false;
  clearCart();
};
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  #receipt-content,
  #receipt-content * {
    visibility: visible;
  }
  #receipt-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}
</style>