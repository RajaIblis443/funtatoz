<template>
  <div>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
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

    <!-- Period Selector & Chart Type Selector -->
    <div class="bg-white rounded-lg shadow mb-8">
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Grafik Keuangan</h3>
          </div>
          
          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <!-- Chart Type Selector -->
            <div class="flex items-center space-x-2">
              <label class="text-sm font-medium text-gray-700">Jenis Chart:</label>
              <div class="flex border border-gray-300 rounded-md overflow-hidden">
                <button 
                  v-for="type in chartTypes" 
                  :key="type.value"
                  @click="chartType = type.value"
                  :class="[
                    'px-3 py-2 text-sm focus:outline-none transition-colors duration-200',
                    chartType === type.value 
                      ? 'bg-primary text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ type.label }}
                </button>
              </div>
            </div>
            
            <!-- Period Selector -->
            <select 
              v-model="selectedPeriod" 
              class="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            >
              <option value="today">Hari Ini</option>
              <option value="day">Harian</option>
              <option value="week">Mingguan</option>
              <option value="month">Bulanan</option>
              <option value="year">Tahunan</option>
              <option value="category">Per Kategori</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="p-6" style="height: 400px">
        <div v-if="keuanganStore.loading" class="h-full flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
        <component 
          v-else
          :is="currentChartComponent" 
          :data="chartData" 
          :options="chartOptions"
        />
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Transaksi Terbaru</h3>
          <router-link to="/transactions" class="text-sm font-medium text-primary hover:text-primary-hover">
            Lihat Semua
          </router-link>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode Barang
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in recentTransactions" :key="transaction.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ transaction.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(transaction.tanggal) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.kode_barang }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.jumlah }}
              </td>
            </tr>
            <tr v-if="recentTransactions.length === 0">
              <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">
                Belum ada transaksi
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// First import necessary types
import { ref, computed, onMounted, watch } from 'vue';
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { useKeuanganStore } from '../store/keuangan.store';
import { useTransaksiStore } from '../store/transaksi.store';
import type { 
  ChartOptions,
  TooltipItem 
} from 'chart.js';

// Register all components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Initialize stores
const keuanganStore = useKeuanganStore();
const transaksiStore = useTransaksiStore();

// Chart period selection
const selectedPeriod = ref<'today' | 'day' | 'week' | 'month' | 'year' | 'category'>('month');

// Chart type selection
type ChartType = 'bar' | 'line' | 'pie' | 'doughnut';
const chartType = ref<ChartType>('bar');
const chartTypes = [
  { label: 'Bar', value: 'bar' as ChartType },
  { label: 'Line', value: 'line' as ChartType },
  { label: 'Pie', value: 'pie' as ChartType },
  { label: 'Doughnut', value: 'doughnut' as ChartType }
];

// Determine which chart component to use based on chartType
const currentChartComponent = computed(() => {
  switch (chartType.value) {
    case 'line': return Line;
    case 'pie': return Pie;
    case 'doughnut': return Doughnut;
    default: return Bar;
  }
});

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([
    keuanganStore.fetchKeuangan(),
    transaksiStore.fetchTransaksi()
  ]);
});

// Format currency helper
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

// Format date helper
const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID').format(date);
};

// Financial summary
const summary = computed(() => ({
  pemasukan: keuanganStore.totalPemasukan,
  pengeluaran: keuanganStore.totalPengeluaran,
  keuntungan: keuanganStore.keuntungan
}));

// Generate chart data based on chart type and period
const chartData = computed(() => {
  // For pie and doughnut charts, we need a different data structure
  if (chartType.value === 'pie' || chartType.value === 'doughnut') {
    const sourceData = getSourceData();
    const labels = Object.keys(sourceData);
    
    return {
      labels,
      datasets: [
        {
          label: 'Pemasukan',
          data: labels.map(label => sourceData[label].masuk),
          backgroundColor: [
            'rgba(48, 152, 152, 0.7)', // primary (tosca)
            'rgba(203, 4, 4, 0.7)',    // danger (merah)
            'rgba(244, 99, 30, 0.7)',   // info (oren)
            'rgba(255, 159, 0, 0.7)',   // warning (kuning)
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 99, 132, 0.7)',
          ],
          borderColor: [
            '#309898', // primary
            '#CB0404', // danger
            '#F4631E', // info
            '#FF9F00', // warning
            '#4bc0c0',
            '#9966ff',
            '#ff6384',
          ],
          borderWidth: 1
        }
      ]
    };
  } else {
    // For bar and line charts, use the standard format
    return keuanganStore.getChartData(selectedPeriod.value);
  }
});

// Helper function to get the right source data based on selected period
function getSourceData() {
  switch(selectedPeriod.value) {
    case 'today':
      if (!keuanganStore.filterStartDate || !isToday(keuanganStore.filterStartDate)) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        keuanganStore.setDateFilter(today, today);
      }
      return keuanganStore.dailyData;
    case 'day':
      return keuanganStore.dailyData;
    case 'week':
      return keuanganStore.weeklyData;
    case 'month':
      return keuanganStore.monthlyData;
    case 'year':
      return keuanganStore.yearlyData;
    case 'category':
      return keuanganStore.monthlyData;
    default:
      return keuanganStore.monthlyData;
  }
}

// Fix the chart options computed property
const chartOptions = computed(() => {
  if (chartType.value === 'pie' || chartType.value === 'doughnut') {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom' as const
        },
        tooltip: {
          callbacks: {
            label: function(context: TooltipItem<ChartType>) {
              const label = context.label || '';
              const value = context.raw as number || 0;
              return `${label}: ${formatCurrency(value)}`;
            }
          }
        }
      }
    } as unknown as ChartOptions<ChartType>;
  } else {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            // Simplified callback to avoid unused params warnings
            callback: function(tickValue: number | string) {
              return formatCurrency(Number(tickValue));
            }
          }
        }
      }
    } as unknown as ChartOptions<ChartType>;
  }
});

// Recent transactions for dashboard
const recentTransactions = computed(() => {
  return transaksiStore.data
    .slice()
    .sort((a, b) => {
      const dateA = new Date(a.tanggal).getTime();
      const dateB = new Date(b.tanggal).getTime();
      return dateB - dateA; // Sort by date descending (newest first)
    })
    .slice(0, 5); // Take only 5 most recent transactions
});

// Additional watch to set today's filter when selecting "Hari Ini"
watch(() => selectedPeriod.value, (newValue) => {
  if (newValue === 'today') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Set the keuangan store's date filters to only show today
    keuanganStore.setDateFilter(today, today);
  } else if (keuanganStore.filterStartDate && isToday(keuanganStore.filterStartDate)) {
    // Reset the date filter when changing from "today" to another period
    keuanganStore.setDateFilter(null, null);
  }
});

// Helper function to check if a date is today
const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};
</script>

<style scoped>
/* Responsively show min content when needed */
@media (max-width: 640px) {
  select {
    width: 100%;
  }
}
</style>