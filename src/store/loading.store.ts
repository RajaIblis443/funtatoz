// filepath: d:\Kentang\web_manajemen_funtatoz\src\store\loading.store.ts
import { defineStore } from "pinia";

export const useLoadingStore = defineStore('loading', {
  state: () => ({
    isLoading: false,
    message: '',
    loadingTasks: 0
  }),
  
  getters: {
    loading: state => state.isLoading
  },
  
  actions: {
    startLoading(message = 'Memproses...') {
      this.loadingTasks++;
      this.isLoading = true;
      this.message = message;
    },
    
    stopLoading() {
      this.loadingTasks--;
      if (this.loadingTasks <= 0) {
        this.isLoading = false;
        this.loadingTasks = 0;
      }
    },
    
    resetLoading() {
      this.isLoading = false;
      this.message = '';
      this.loadingTasks = 0;
    }
  }
});