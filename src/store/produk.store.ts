import { defineStore } from "pinia";
import ProdukService from "../services/produk.service";
import type { Produk } from "../types/produk.type";
import { useLoadingStore } from "./loading.store";
import { useToastStore } from "./toast.store";

const produkService = new ProdukService();

export const useProdukStore = defineStore('produk', {
  state: () => ({
    data: [] as Produk[],
    loading: false,
    error: null as string | null,
    filterKeyword: '' as string,
  }),
  getters: {
    getProdukById: (state) => (id: number) => { 
      return state.data.find((produk) => produk.id === id);
    },
    filteredProduk(state) {
      if (!state.filterKeyword || state.filterKeyword.trim() === '') {
        return state.data;
      }
      
      const keyword = state.filterKeyword.toLowerCase();
      return state.data.filter((produk) => {
        return (
          produk.nama_barang.toLowerCase().includes(keyword) || 
          produk.id.toString().includes(keyword) ||
          produk.harga.toString().includes(keyword)
        );
      });
    },
    produkCount(state) {
      return state.data.length;
    },
  },
  actions: {
    async fetchProduk() {
      const loadingStore = useLoadingStore();
      const toastStore = useToastStore();
      
      this.loading = true;
      loadingStore.startLoading('Mengambil data produk...');
      
      try {
        const response = await produkService.getProduk();
        this.data = Array.isArray(response) ? response : [];
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(this.error);
        toastStore.error('Gagal mengambil data produk');
      } finally {
        this.loading = false;
        loadingStore.stopLoading();
      }
    },

    async addProduk(produk: Produk) {
      const loadingStore = useLoadingStore();
      const toastStore = useToastStore();
      
      this.loading = true;
      loadingStore.startLoading('Menambahkan produk baru...');
      
      try {
        const response = await produkService.addTransaksi(produk);
        await this.fetchProduk(); 
        toastStore.success('Produk berhasil ditambahkan');
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(this.error);
        toastStore.error('Gagal menambahkan produk');
      } finally {
        this.loading = false;
        loadingStore.stopLoading();
      }
    },

    async updateProduk(produk: Produk) {
      const loadingStore = useLoadingStore();
      const toastStore = useToastStore();
      
      this.loading = true;
      loadingStore.startLoading('Memperbarui produk...');
      
      try {
        const response = await produkService.updateTransaksi(produk);
        await this.fetchProduk();
        toastStore.success('Produk berhasil diperbarui');
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(this.error);
        toastStore.error('Gagal memperbarui produk');
      } finally {
        this.loading = false;
        loadingStore.stopLoading();
      }
    },

    async deleteProduk(id: string) {
      const loadingStore = useLoadingStore();
      const toastStore = useToastStore();
      
      this.loading = true;
      loadingStore.startLoading('Menghapus produk...');
      
      try {
        const response = await produkService.deleteTransaksi(id);
        await this.fetchProduk(); // Refresh the data
        toastStore.success('Produk berhasil dihapus');
        return response;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(this.error);
        toastStore.error('Gagal menghapus produk');
      } finally {
        this.loading = false;
        loadingStore.stopLoading();
      }
    },

    // Set keyword filter
    setKeywordFilter(keyword: string) {
      this.filterKeyword = keyword;
    },

    // Clear keyword filter
    clearKeywordFilter() {
      this.filterKeyword = '';
    }
  }
})