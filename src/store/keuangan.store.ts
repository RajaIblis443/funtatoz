import { defineStore } from "pinia";
import KeuanganService from "../services/keuangan.service";
import type Keuangan from "../types/keuangan.type";

const keuanganService = new KeuanganService();

export const useKeuanganStore = defineStore('keuangan', {
  state: () => ({
    data: [] as Keuangan[],
    loading: false,
    error: null as string | null,
    // Filters
    filterStartDate: null as Date | null,
    filterEndDate: null as Date | null,
    filterType: null as 'masuk' | 'keluar' | null,
    filterKeyword: '' as string,
  }),
  
  getters: {
    // Basic filters
    filteredTransaksi(state) {
      return state.data.filter(transaksi => {
        // Date filtering
        if (state.filterStartDate || state.filterEndDate) {
          const transaksiDate = transaksi.tanggal instanceof Date 
            ? transaksi.tanggal 
            : new Date(transaksi.tanggal);
          
          if (state.filterStartDate && transaksiDate < state.filterStartDate) {
            return false;
          }
          
          if (state.filterEndDate) {
            const endDate = new Date(state.filterEndDate);
            endDate.setHours(23, 59, 59, 999);
            if (transaksiDate > endDate) {
              return false;
            }
          }
        }
        
        // Type filtering (masuk/keluar)
        if (state.filterType && transaksi.tipe !== state.filterType) {
          return false;
        }
        
        // Keyword filtering
        if (state.filterKeyword && state.filterKeyword.trim() !== '') {
          const keyword = state.filterKeyword.toLowerCase();
          const matchesKeyword = 
            transaksi.keterangan?.toLowerCase().includes(keyword) || 
            false;
            
          if (!matchesKeyword) {
            return false;
          }
        }
        
        return true;
      });
    },
    
    totalPemasukan(state) {
      // Use the same filtering logic as filteredTransaksi but directly on state
      return state.data
        .filter(transaksi => {
          // Apply all filters
          if (state.filterStartDate || state.filterEndDate) {
            const transaksiDate = transaksi.tanggal instanceof Date 
              ? transaksi.tanggal 
              : new Date(transaksi.tanggal);
            
            if (state.filterStartDate && transaksiDate < state.filterStartDate) {
              return false;
            }
            
            if (state.filterEndDate) {
              const endDate = new Date(state.filterEndDate);
              endDate.setHours(23, 59, 59, 999);
              if (transaksiDate > endDate) {
                return false;
              }
            }
          }
          
          if (state.filterKeyword && state.filterKeyword.trim() !== '') {
            const keyword = state.filterKeyword.toLowerCase();
            const matchesKeyword = 
              transaksi.keterangan?.toLowerCase().includes(keyword) || 
              false;
            
            if (!matchesKeyword) {
              return false;
            }
          }
          
          // Type filter fixed to 'masuk' for this getter
          return transaksi.tipe === 'masuk';
        })
        .reduce((sum, transaksi) => sum + Number(transaksi.nominal || 0), 0);
    },
    
    totalPengeluaran(state) {
      // Use the same filtering logic as filteredTransaksi but directly on state
      return state.data
        .filter(transaksi => {
          // Apply all filters
          if (state.filterStartDate || state.filterEndDate) {
            const transaksiDate = transaksi.tanggal instanceof Date 
              ? transaksi.tanggal 
              : new Date(transaksi.tanggal);
            
            if (state.filterStartDate && transaksiDate < state.filterStartDate) {
              return false;
            }
            
            if (state.filterEndDate) {
              const endDate = new Date(state.filterEndDate);
              endDate.setHours(23, 59, 59, 999);
              if (transaksiDate > endDate) {
                return false;
              }
            }
          }
          
          if (state.filterKeyword && state.filterKeyword.trim() !== '') {
            const keyword = state.filterKeyword.toLowerCase();
            const matchesKeyword = 
              transaksi.keterangan?.toLowerCase().includes(keyword) || 
              false;
            
            if (!matchesKeyword) {
              return false;
            }
          }
          
          // Type filter fixed to 'keluar' for this getter
          return transaksi.tipe === 'keluar';
        })
        .reduce((sum, transaksi) => sum + Number(transaksi.nominal || 0), 0);
    },
    
    keuntungan(state) {
      // Calculate directly from state to avoid the 'this' reference issue
      const pemasukan = state.data
        .filter(transaksi => {
          // Apply all filters
          if (state.filterStartDate || state.filterEndDate) {
            const transaksiDate = transaksi.tanggal instanceof Date 
              ? transaksi.tanggal 
              : new Date(transaksi.tanggal);
            
            if (state.filterStartDate && transaksiDate < state.filterStartDate) {
              return false;
            }
            
            if (state.filterEndDate) {
              const endDate = new Date(state.filterEndDate);
              endDate.setHours(23, 59, 59, 999);
              if (transaksiDate > endDate) {
                return false;
              }
            }
          }
          
          if (state.filterKeyword && state.filterKeyword.trim() !== '') {
            const keyword = state.filterKeyword.toLowerCase();
            const matchesKeyword = 
              transaksi.keterangan?.toLowerCase().includes(keyword) || 
              false;
            
            if (!matchesKeyword) {
              return false;
            }
          }
          
          return transaksi.tipe === 'masuk';
        })
        .reduce((sum, transaksi) => sum + Number(transaksi.nominal || 0), 0);
        
      const pengeluaran = state.data
        .filter(transaksi => {
          // Apply all filters
          if (state.filterStartDate || state.filterEndDate) {
            const transaksiDate = transaksi.tanggal instanceof Date 
              ? transaksi.tanggal 
              : new Date(transaksi.tanggal);
            
            if (state.filterStartDate && transaksiDate < state.filterStartDate) {
              return false;
            }
            
            if (state.filterEndDate) {
              const endDate = new Date(state.filterEndDate);
              endDate.setHours(23, 59, 59, 999);
              if (transaksiDate > endDate) {
                return false;
              }
            }
          }
          
          if (state.filterKeyword && state.filterKeyword.trim() !== '') {
            const keyword = state.filterKeyword.toLowerCase();
            const matchesKeyword = 
              transaksi.keterangan?.toLowerCase().includes(keyword) || 
              false;
            
            if (!matchesKeyword) {
              return false;
            }
          }
          
          return transaksi.tipe === 'keluar';
        })
        .reduce((sum, transaksi) => sum + Number(transaksi.nominal || 0), 0);
        
      return pemasukan - pengeluaran;
    },
    
    // Time-based analytics
    dailyData(state) {
      const result: Record<string, { masuk: number, keluar: number }> = {};
      
      // Filter data directly from state using the same filtering logic
      const filteredData = state.data.filter(transaksi => {
        // Date filtering
        if (state.filterStartDate || state.filterEndDate) {
          const transaksiDate = transaksi.tanggal instanceof Date 
            ? transaksi.tanggal 
            : new Date(transaksi.tanggal);
          
          if (state.filterStartDate && transaksiDate < state.filterStartDate) {
            return false;
          }
          
          if (state.filterEndDate) {
            const endDate = new Date(state.filterEndDate);
            endDate.setHours(23, 59, 59, 999);
            if (transaksiDate > endDate) {
              return false;
            }
          }
        }
        
        // Type filtering (masuk/keluar)
        if (state.filterType && transaksi.tipe !== state.filterType) {
          return false;
        }
        
        // Keyword filtering
        if (state.filterKeyword && state.filterKeyword.trim() !== '') {
          const keyword = state.filterKeyword.toLowerCase();
          const matchesKeyword = 
            transaksi.keterangan?.toLowerCase().includes(keyword) || 
            false;
            
          if (!matchesKeyword) {
            return false;
          }
        }
        
        return true;
      });
      
      filteredData.forEach(transaksi => {
        const date = new Date(transaksi.tanggal);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!result[dateStr]) {
          result[dateStr] = { masuk: 0, keluar: 0 };
        }
        
        if (transaksi.tipe === 'masuk') {
          result[dateStr].masuk += Number(transaksi.nominal || 0);
        } else if (transaksi.tipe === 'keluar') {
          result[dateStr].keluar += Number(transaksi.nominal || 0);
        }
      });
      
      return result;
    },
    
    weeklyData(state) {
      // Use the refactored filtering approach
      const result: Record<string, { masuk: number, keluar: number }> = {};
      
      // Filter data directly using the same filtering logic
      const filteredData = state.data.filter(transaksi => {
        // Apply all filters (same as filteredTransaksi)
        // Date filtering
        if (state.filterStartDate || state.filterEndDate) {
          const transaksiDate = transaksi.tanggal instanceof Date 
            ? transaksi.tanggal 
            : new Date(transaksi.tanggal);
          
          if (state.filterStartDate && transaksiDate < state.filterStartDate) {
            return false;
          }
          
          if (state.filterEndDate) {
            const endDate = new Date(state.filterEndDate);
            endDate.setHours(23, 59, 59, 999);
            if (transaksiDate > endDate) {
              return false;
            }
          }
        }
        
        // Type filtering (masuk/keluar)
        if (state.filterType && transaksi.tipe !== state.filterType) {
          return false;
        }
        
        // Keyword filtering
        if (state.filterKeyword && state.filterKeyword.trim() !== '') {
          const keyword = state.filterKeyword.toLowerCase();
          const matchesKeyword = 
            transaksi.keterangan?.toLowerCase().includes(keyword) || 
            false;
            
          if (!matchesKeyword) {
            return false;
          }
        }
        
        return true;
      });
      
      filteredData.forEach(transaksi => {
        const date = new Date(transaksi.tanggal);
        const year = date.getFullYear();
        const weekNum = Math.ceil(
          ((date.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7
        );
        
        const weekKey = `${year}-W${weekNum.toString().padStart(2, '0')}`;
        
        if (!result[weekKey]) {
          result[weekKey] = { masuk: 0, keluar: 0 };
        }
        
        if (transaksi.tipe === 'masuk') {
          result[weekKey].masuk += Number(transaksi.nominal || 0);
        } else if (transaksi.tipe === 'keluar') {
          result[weekKey].keluar += Number(transaksi.nominal || 0);
        }
      });
      
      return result;
    },
    
    monthlyData(state) {
      // Use the refactored filtering approach
      const result: Record<string, { masuk: number, keluar: number }> = {};
      
      // Filter data directly using the same filtering logic
      const filteredData = state.data.filter(transaksi => {
        // Apply all filters (same as filteredTransaksi)
        // Date filtering
        if (state.filterStartDate || state.filterEndDate) {
          const transaksiDate = transaksi.tanggal instanceof Date 
            ? transaksi.tanggal 
            : new Date(transaksi.tanggal);
          
          if (state.filterStartDate && transaksiDate < state.filterStartDate) {
            return false;
          }
          
          if (state.filterEndDate) {
            const endDate = new Date(state.filterEndDate);
            endDate.setHours(23, 59, 59, 999);
            if (transaksiDate > endDate) {
              return false;
            }
          }
        }
        
        // Type filtering (masuk/keluar)
        if (state.filterType && transaksi.tipe !== state.filterType) {
          return false;
        }
        
        // Keyword filtering
        if (state.filterKeyword && state.filterKeyword.trim() !== '') {
          const keyword = state.filterKeyword.toLowerCase();
          const matchesKeyword = 
            transaksi.keterangan?.toLowerCase().includes(keyword) || 
            false;
            
          if (!matchesKeyword) {
            return false;
          }
        }
        
        return true;
      });
      
      filteredData.forEach(transaksi => {
        const date = new Date(transaksi.tanggal);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1-12
        
        const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
        
        if (!result[monthKey]) {
          result[monthKey] = { masuk: 0, keluar: 0 };
        }
        
        if (transaksi.tipe === 'masuk') {
          result[monthKey].masuk += Number(transaksi.nominal || 0);
        } else if (transaksi.tipe === 'keluar') {
          result[monthKey].keluar += Number(transaksi.nominal || 0);
        }
      });
      
      return result;
    },
    
    yearlyData(state) {
      // Use the refactored filtering approach
      const result: Record<string, { masuk: number, keluar: number }> = {};
      
      // Filter data directly using the same filtering logic
      const filteredData = state.data.filter(transaksi => {
        // Apply all filters (same as filteredTransaksi)
        // Date filtering
        if (state.filterStartDate || state.filterEndDate) {
          const transaksiDate = transaksi.tanggal instanceof Date 
            ? transaksi.tanggal 
            : new Date(transaksi.tanggal);
          
          if (state.filterStartDate && transaksiDate < state.filterStartDate) {
            return false;
          }
          
          if (state.filterEndDate) {
            const endDate = new Date(state.filterEndDate);
            endDate.setHours(23, 59, 59, 999);
            if (transaksiDate > endDate) {
              return false;
            }
          }
        }
        
        // Type filtering (masuk/keluar)
        if (state.filterType && transaksi.tipe !== state.filterType) {
          return false;
        }
        
        // Keyword filtering
        if (state.filterKeyword && state.filterKeyword.trim() !== '') {
          const keyword = state.filterKeyword.toLowerCase();
          const matchesKeyword = 
            transaksi.keterangan?.toLowerCase().includes(keyword) || 
            false;
            
          if (!matchesKeyword) {
            return false;
          }
        }
        
        return true;
      });
      
      filteredData.forEach(transaksi => {
        const date = new Date(transaksi.tanggal);
        const year = date.getFullYear();
        
        const yearKey = `${year}`;
        
        if (!result[yearKey]) {
          result[yearKey] = { masuk: 0, keluar: 0 };
        }
        
        if (transaksi.tipe === 'masuk') {
          result[yearKey].masuk += Number(transaksi.nominal || 0);
        } else if (transaksi.tipe === 'keluar') {
          result[yearKey].keluar += Number(transaksi.nominal || 0);
        }
      });
      
      return result;
    },
    
    // Chart data formatters
    getChartData: () => (period: 'today' | 'day' | 'week' | 'month' | 'year' | 'category') => {
      let sourceData;
      const store = useKeuanganStore();
      
      // Special handling for "today" filter
      if (period === 'today') {
        // Jika belum ada filter tanggal yang ditetapkan, atur filter ke hari ini
        if (!store.filterStartDate || !isToday(store.filterStartDate)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          store.setDateFilter(today, today);
        }
        
        // Gunakan data harian untuk tampilan "Hari Ini"
        sourceData = store.dailyData;
      } else {
        switch(period) {
          case 'day':
            sourceData = store.dailyData;
            break;
          case 'week':
            sourceData = store.weeklyData;
            break;
          case 'month':
            sourceData = store.monthlyData;
            break;
          case 'year':
            sourceData = store.yearlyData;
            break;
          case 'category':
            sourceData = store.monthlyData;
            break;
          default:
            sourceData = store.monthlyData;
        }
      }
      
      const labels = Object.keys(sourceData);
      const pemasukanData = labels.map(label => sourceData[label].masuk);
      const pengeluaranData = labels.map(label => sourceData[label].keluar);
      const keuntunganData = labels.map(label => sourceData[label].masuk - sourceData[label].keluar);
      
      // Menggunakan warna branding untuk datasets
      return {
        labels,
        datasets: [
          {
            label: 'Pemasukan',
            data: pemasukanData,
            backgroundColor: 'rgba(48, 152, 152, 0.2)', // primary (tosca)
            borderColor: '#309898', // primary color
            borderWidth: 1
          },
          {
            label: 'Pengeluaran',
            data: pengeluaranData,
            backgroundColor: 'rgba(203, 4, 4, 0.2)', // danger (merah)
            borderColor: '#CB0404', // danger color
            borderWidth: 1
          },
          {
            label: 'Keuntungan',
            data: keuntunganData,
            backgroundColor: 'rgba(244, 99, 30, 0.2)', // info (oren)
            borderColor: '#F4631E', // info color
            borderWidth: 1
          }
        ]
      };
    }
  },
  
  actions: {
    async fetchKeuangan() {
      this.loading = true;
      this.error = null;
      try {
        const response = await keuanganService.getKeuangan();
        this.data = Array.isArray(response) ? response : [];
        console.log('Data fetched successfully:', this.data);
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async addTransaksi(transaksi: Keuangan) {
      this.loading = true;
      this.error = null;
      try {
        const response = await keuanganService.addTransaksi(transaksi);
        await this.fetchKeuangan(); // Refresh the data
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async updateTransaksi(transaksi: Keuangan) {
      this.loading = true;
      this.error = null;
    
      try {
        const response = await keuanganService.updateTransaksi(transaksi);
        await this.fetchKeuangan(); // Refresh the data
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async deleteTransaksi(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await keuanganService.deleteTransaksi(Number(id));
        await this.fetchKeuangan(); // Refresh the data
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    // Filter actions
    setDateFilter(startDate: Date | null, endDate: Date | null) {
      this.filterStartDate = startDate;
      this.filterEndDate = endDate;
    },

    setTypeFilter(type: 'masuk' | 'keluar' | null) {
      this.filterType = type;
    },

    setKeywordFilter(keyword: string) {
      this.filterKeyword = keyword;
    },

    clearAllFilters() {
      this.filterStartDate = null;
      this.filterEndDate = null;
      this.filterType = null;
      this.filterKeyword = '';
    }
  }
});

// Tambahkan helper function ini di file, di luar store definition
function isToday(date: Date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}
