import { defineStore } from "pinia";

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

let nextId = 0;

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: [] as Toast[]
  }),
  
  actions: {
    addToast(message: string, type: 'success' | 'error' | 'info' | 'warning', duration = 3000) {
      const id = nextId++;
      const toast = { id, message, type, duration };
      this.toasts.push(toast);
      
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    },
    
    removeToast(id: number) {
      const index = this.toasts.findIndex(toast => toast.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },
    
    success(message: string, duration?: number) {
      this.addToast(message, 'success', duration);
    },
    
    error(message: string, duration?: number) {
      this.addToast(message, 'error', duration);
    },
    
    info(message: string, duration?: number) {
      this.addToast(message, 'info', duration);
    },
    
    warning(message: string, duration?: number) {
      this.addToast(message, 'warning', duration);
    }
  }
});