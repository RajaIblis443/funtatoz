<script setup lang="ts">
import { useTransaksiStore } from '../store/transaksi.store';
import { ref, onMounted, computed } from 'vue';
import type { Transaksi } from '../types/transaksi.type';

const transaksiStore = useTransaksiStore();

// Modal state
const showModal = ref(false);
const isEditing = ref(false);
const currentTransaksi = ref<Transaksi>({
  id: 0,
  tanggal: new Date().toISOString().split('T')[0],
  kode_barang: 0,
  jumlah: 1
});

// Filter states
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
const selectedKodeBarang = ref<number | null>(null);
const searchKeyword = ref('');

onMounted(async () => {
  await transaksiStore.fetchTransaksi();
});

// Apply filters
function applyFilters() {
  transaksiStore.setDateFilter(
    startDate.value ? new Date(startDate.value) : null,
    endDate.value ? new Date(endDate.value) : null
  );
  transaksiStore.setKodeBarangFilter(selectedKodeBarang.value);
  transaksiStore.setKeywordFilter(searchKeyword.value);
}

function resetFilters() {
  startDate.value = null;
  endDate.value = null;
  selectedKodeBarang.value = null;
  searchKeyword.value = '';
  transaksiStore.clearAllFilters();
}

// Modal handlers
function openAddModal() {
  currentTransaksi.value = {
    id: 0,
    tanggal: new Date().toISOString().split('T')[0],
    kode_barang: 0,
    jumlah: 1
  };
  isEditing.value = false;
  showModal.value = true;
}

function openEditModal(transaksi: Transaksi) {
  currentTransaksi.value = { ...transaksi };
  if (typeof currentTransaksi.value.tanggal === 'string') {
    // Format date for input field
    currentTransaksi.value.tanggal = currentTransaksi.value.tanggal.split('T')[0];
  }
  isEditing.value = true;
  showModal.value = true;
}

async function submitForm() {
  try {
    if (isEditing.value) {
      await transaksiStore.updateTransaksi(currentTransaksi.value);
    } else {
      await transaksiStore.addTransaksi(currentTransaksi.value);
    }
    showModal.value = false;
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
}

async function deleteTransaction(id: number) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    try {
      await transaksiStore.deleteTransaksi(id.toString());
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }
}

// Format date for display
function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID');
}

const filteredTransaksiList = computed(() => transaksiStore.filteredTransaksi);
const uniqueKodeBarang = computed(() => transaksiStore.uniqueKodeBarang);
const totalItems = computed(() => transaksiStore.totalItems);
</script>

<template>
  <div class="transaksi-container">
    <h2>Daftar Transaksi</h2>
    
    <!-- Loading indicator -->
    <div v-if="transaksiStore.loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>Loading transactions...</p>
    </div>
    
    <!-- Error message -->
    <div v-if="transaksiStore.error" class="error-message">
      <p>Error: {{ transaksiStore.error }}</p>
    </div>
    
    <!-- Filters -->
    <div class="filters-container">
      <div class="filter-group">
        <label>Dari Tanggal:</label>
        <input type="date" v-model="startDate" @change="applyFilters">
      </div>
      
      <div class="filter-group">
        <label>Sampai Tanggal:</label>
        <input type="date" v-model="endDate" @change="applyFilters">
      </div>
      
      <div class="filter-group">
        <label>Kode Barang:</label>
        <select v-model="selectedKodeBarang" @change="applyFilters">
          <option :value="null">Semua Barang</option>
          <option v-for="kode in uniqueKodeBarang" :key="kode" :value="kode">
            {{ kode }}
          </option>
        </select>
      </div>
      
      <div class="filter-group">
        <label>Pencarian:</label>
        <input type="text" v-model="searchKeyword" @input="applyFilters" placeholder="Cari...">
      </div>
      
      <button @click="resetFilters" class="reset-button">Reset Filters</button>
    </div>
    
    <!-- Transaction summary -->
    <div class="transaction-summary">
      <p>Total Items: <strong>{{ totalItems }}</strong></p>
      <p>Total Transaksi: <strong>{{ filteredTransaksiList.length }}</strong></p>
    </div>
    
    <!-- Add new transaction button -->
    <div class="action-buttons">
      <button @click="openAddModal" class="add-button">Tambah Transaksi</button>
    </div>
    
    <!-- Transactions table -->
    <table class="transactions-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Tanggal</th>
          <th>Kode Barang</th>
          <th>Jumlah</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaksi in filteredTransaksiList" :key="transaksi.id">
          <td>{{ transaksi.id }}</td>
          <td>{{ formatDate(transaksi.tanggal) }}</td>
          <td>{{ transaksi.kode_barang }}</td>
          <td>{{ transaksi.jumlah }}</td>
          <td class="actions">
            <button @click="openEditModal(transaksi)" class="edit-button">Edit</button>
            <button @click="deleteTransaction(transaksi.id)" class="delete-button">Delete</button>
          </td>
        </tr>
        <tr v-if="filteredTransaksiList.length === 0">
          <td colspan="5" class="no-data">No transactions found</td>
        </tr>
      </tbody>
    </table>
    
    <!-- Modal for adding/editing transactions -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>{{ isEditing ? 'Edit Transaksi' : 'Tambah Transaksi' }}</h3>
        
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="tanggal">Tanggal:</label>
            <input 
              id="tanggal"
              type="date" 
              v-model="currentTransaksi.tanggal"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="kode_barang">Kode Barang:</label>
            <input 
              id="kode_barang"
              type="number" 
              v-model="currentTransaksi.kode_barang"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="jumlah">Jumlah:</label>
            <input 
              id="jumlah"
              type="number" 
              v-model="currentTransaksi.jumlah"
              min="1"
              required
            >
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showModal = false">Cancel</button>
            <button type="submit">{{ isEditing ? 'Update' : 'Add' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaksi-container {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.loading-indicator {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #333;
  animation: spin 1s ease-in-out infinite;
  margin-right: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin: 20px 0;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  margin-bottom: 5px;
  font-size: 14px;
}

.filter-group input,
.filter-group select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.reset-button {
  background-color: #6c757d;
  color: white;
}

.add-button {
  background-color: #28a745;
  color: white;
  margin-bottom: 20px;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transactions-table th,
.transactions-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.transactions-table th {
  background-color: #f2f2f2;
}

.transactions-table tr:hover {
  background-color: #f9f9f9;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-button {
  background-color: #007bff;
  color: white;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}

.transaction-summary {
  margin: 20px 0;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>