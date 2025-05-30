import { defineStore } from "pinia";
import TransaksiService from "../services/transaksi.service";
import type { Transaksi } from "../types/transaksi.type";

const transaksiService = new TransaksiService();


const applyFilters = (data: Transaksi[], filters: {
  filterStartDate: Date | null,
  filterEndDate: Date | null,
  filterKodeBarang: number | null,
  filterKeyword: string
}) => {
  return data.filter(transaksi => {
    // Date filtering
    if (filters.filterStartDate || filters.filterEndDate) {
      const transaksiDate = transaksi.tanggal instanceof Date 
        ? transaksi.tanggal 
        : new Date(transaksi.tanggal);
      
      if (filters.filterStartDate && transaksiDate < filters.filterStartDate) {
        return false;
      }
      
      if (filters.filterEndDate) {
        const endDate = new Date(filters.filterEndDate);
        endDate.setHours(23, 59, 59, 999);
        if (transaksiDate > endDate) {
          return false;
        }
      }
    }
    
    // Kode Barang filtering
    if (filters.filterKodeBarang && transaksi.kode_barang !== filters.filterKodeBarang) {
      return false;
    }
    
    // Keyword filtering
    if (filters.filterKeyword && filters.filterKeyword.trim() !== '') {
      const keyword = filters.filterKeyword.toLowerCase();
      const matchesKeyword = 
        transaksi.id!.toString().includes(keyword) || 
        transaksi.kode_barang.toString().includes(keyword) ||
        false;
        
      if (!matchesKeyword) {
        return false;
      }
    }
    
    return true;
  });
};

export const useTransaksiStore = defineStore('transaksi', {
  state: () => ({
    data: [] as Transaksi[],
    loading: false,
    error: null as string | null,
    // Filters
    filterStartDate: null as Date | null,
    filterEndDate: null as Date | null,
    filterKodeBarang: null as number | null,
    filterKeyword: '' as string,
  }),
  
  getters: {
    // Get filtered transactions
    filteredTransaksi(state) {
      return applyFilters(state.data, {
        filterStartDate: state.filterStartDate,
        filterEndDate: state.filterEndDate,
        filterKodeBarang: state.filterKodeBarang,
        filterKeyword: state.filterKeyword
      });
    },
    
    // Get all unique product codes
    uniqueKodeBarang(state) {
      return [...new Set(state.data.map(transaksi => transaksi.kode_barang))].sort((a, b) => a - b);
    },
    
    // Get total items sold
    totalItems(state) {
      return applyFilters(state.data, {
        filterStartDate: state.filterStartDate,
        filterEndDate: state.filterEndDate,
        filterKodeBarang: state.filterKodeBarang,
        filterKeyword: state.filterKeyword
      }).reduce((sum, transaksi) => sum + Number(transaksi.jumlah || 0), 0);
    },
    
    // Group transactions by product code
    transactionsByProduct(state) {
      const result: Record<number, number> = {};
      
      const filtered = applyFilters(state.data, {
        filterStartDate: state.filterStartDate,
        filterEndDate: state.filterEndDate,
        filterKodeBarang: state.filterKodeBarang,
        filterKeyword: state.filterKeyword
      });
      
      filtered.forEach((transaksi: Transaksi) => {
        const kodeBarang = transaksi.kode_barang;
        
        if (!result[kodeBarang]) {
          result[kodeBarang] = 0;
        }
        
        result[kodeBarang] += Number(transaksi.jumlah || 0);
      });
      
      return result;
    },
    
    // Time-based analytics
    dailyTransactions(state) {
      const result: Record<string, { transactions: Transaksi[], totalItems: number }> = {};
      
      const filtered = applyFilters(state.data, {
        filterStartDate: state.filterStartDate,
        filterEndDate: state.filterEndDate,
        filterKodeBarang: state.filterKodeBarang,
        filterKeyword: state.filterKeyword
      });
      
      filtered.forEach((transaksi: Transaksi) => {
        const date = new Date(transaksi.tanggal);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!result[dateStr]) {
          result[dateStr] = { transactions: [], totalItems: 0 };
        }
        
        result[dateStr].transactions.push(transaksi);
        result[dateStr].totalItems += Number(transaksi.jumlah || 0);
      });
      
      return result;
    },
    
    weeklyTransactions(state) {
      const result: Record<string, { transactions: Transaksi[], totalItems: number }> = {};
      
      const filtered = applyFilters(state.data, {
        filterStartDate: state.filterStartDate,
        filterEndDate: state.filterEndDate,
        filterKodeBarang: state.filterKodeBarang,
        filterKeyword: state.filterKeyword
      });
      
      filtered.forEach((transaksi: Transaksi) => {
        const date = new Date(transaksi.tanggal);
        const year = date.getFullYear();
        const weekNum = Math.ceil(
          ((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7
        );
        
        const weekKey = `${year}-W${weekNum.toString().padStart(2, '0')}`;
        
        if (!result[weekKey]) {
          result[weekKey] = { transactions: [], totalItems: 0 };
        }
        
        result[weekKey].transactions.push(transaksi);
        result[weekKey].totalItems += Number(transaksi.jumlah || 0);
      });
      
      return result;
    },
    
    monthlyTransactions(state) {
      const result: Record<string, { transactions: Transaksi[], totalItems: number }> = {};
      
      const filtered = applyFilters(state.data, {
        filterStartDate: state.filterStartDate,
        filterEndDate: state.filterEndDate,
        filterKodeBarang: state.filterKodeBarang,
        filterKeyword: state.filterKeyword
      });
      
      filtered.forEach((transaksi: Transaksi) => {
        const date = new Date(transaksi.tanggal);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1-12
        
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
        
        if (!result[monthKey]) {
          result[monthKey] = { transactions: [], totalItems: 0 };
        }
        
        result[monthKey].transactions.push(transaksi);
        result[monthKey].totalItems += Number(transaksi.jumlah || 0);
      });
      
      return result;
    },
    
    // Chart data formatter
    getChartData: () => (period: 'day' | 'week' | 'month' | 'year' | 'product') => {
      const store = useTransaksiStore();
      let labels: string[] = [];
      let datasets: any[] = [];
      
      switch(period) {
        case 'day': {
          const dailyData = store.dailyTransactions;
          labels = Object.keys(dailyData);
          const values = labels.map(label => dailyData[label].totalItems);
          
          datasets = [{
            label: 'Items Sold',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }];
          break;
        }
        
        case 'week': {
          const weeklyData = store.weeklyTransactions;
          labels = Object.keys(weeklyData);
          const values = labels.map(label => weeklyData[label].totalItems);
          
          datasets = [{
            label: 'Items Sold',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }];
          break;
        }
        
        case 'month': {
          const monthlyData = store.monthlyTransactions;
          labels = Object.keys(monthlyData);
          const values = labels.map(label => monthlyData[label].totalItems);
          
          datasets = [{
            label: 'Items Sold',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }];
          break;
        }
        
        case 'product': {
          const productData = store.transactionsByProduct;
          labels = Object.keys(productData).map(code => `Product ${code}`);
          const values = Object.values(productData);
          
          datasets = [{
            label: 'Items Sold by Product',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1
          }];
          break;
        }
        
        default: {
          const monthlyData = store.monthlyTransactions;
          labels = Object.keys(monthlyData);
          const values = labels.map(label => monthlyData[label].totalItems);
          
          datasets = [{
            label: 'Items Sold',
            data: values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1
          }];
        }
      }
      
      return { labels, datasets };
    }
  },
  
  actions: {
    async fetchTransaksi() {
      this.loading = true;
      this.error = null;
      try {
        const response = await transaksiService.getTransaksi();
        this.data = Array.isArray(response) ? response : [];
        console.log('Transactions fetched successfully:', this.data);
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error fetching transactions:', this.error);
      } finally {
        this.loading = false;
      }
    },

    async addTransaksi(transaksi: Transaksi) {
      this.loading = true;
      this.error = null;
      try {
        const response = await transaksiService.addTransaksi(transaksi);
        await this.fetchTransaksi(); // Refresh data after adding
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error adding transaction:', this.error);
      } finally {
        this.loading = false;
      }
    },

    async updateTransaksi(transaksi: Transaksi) {
      this.loading = true;
      this.error = null;
      try {
        const response = await transaksiService.updateTransaksi(transaksi);
        await this.fetchTransaksi(); // Refresh data after updating
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error updating transaction:', this.error);
      } finally {
        this.loading = false;
      }
    },

    async deleteTransaksi(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await transaksiService.deleteTransaksi(Number(id));
        await this.fetchTransaksi(); // Refresh data after deleting
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error deleting transaction:', this.error);
      } finally {
        this.loading = false;
      }
    },
    
    // Filters
    setDateFilter(startDate: Date | null, endDate: Date | null) {
      this.filterStartDate = startDate;
      this.filterEndDate = endDate;
    },
    
    setKodeBarangFilter(kodeBarang: number | null) {
      this.filterKodeBarang = kodeBarang;
    },
    
    setKeywordFilter(keyword: string) {
      this.filterKeyword = keyword;
    },
    
    clearAllFilters() {
      this.filterStartDate = null;
      this.filterEndDate = null;
      this.filterKodeBarang = null;
      this.filterKeyword = '';
    }
  }
});