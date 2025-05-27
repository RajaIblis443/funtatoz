<script setup lang="ts">
import { useKeuanganStore } from '../store/keuangan.store';
import { ref, onMounted, computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const keuanganStore = useKeuanganStore();
const selectedPeriod = ref<'day' | 'week' | 'month' | 'year' | 'category'>('month');


onMounted(async () => {
  await keuanganStore.fetchKeuangan();
});

// Get chart data based on selected period
const chartData = computed(() => keuanganStore.getChartData(selectedPeriod.value));

// Financial summary
const summary = computed(() => ({
  pemasukan: keuanganStore.totalPemasukan.toLocaleString('id-ID'),
  pengeluaran: keuanganStore.totalPengeluaran.toLocaleString('id-ID'),
  keuntungan: keuanganStore.keuntungan.toLocaleString('id-ID')
}));

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
</script>

<template>
  <div>
    <h1>Dashboard Keuangan</h1>

    <!-- Financial Summary -->
    <div class="summary-cards">
      <div class="card income-card">
        <h3>Total Pemasukan</h3>
        <p>Rp {{ summary.pemasukan }}</p>
      </div>
      <div class="card expense-card">
        <h3>Total Pengeluaran</h3>
        <p>Rp {{ summary.pengeluaran }}</p>
      </div>
      <div class="card profit-card">
        <h3>Keuntungan</h3>
        <p>Rp {{ summary.keuntungan }}</p>
      </div>
    </div>

    <!-- Period Selector -->
    <div class="period-selector">
      <select v-model="selectedPeriod">
        <option value="day">Harian</option>
        <option value="week">Mingguan</option>
        <option value="month">Bulanan</option>
        <option value="year">Tahunan</option>
        <option value="category">Per Kategori</option>
      </select>
    </div>

    <!-- Chart -->
    <div class="chart-container" style="height: 400px">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
