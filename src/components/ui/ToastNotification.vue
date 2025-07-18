<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none">
    <TransitionGroup
      name="toast"
      tag="div"
      class="space-y-2"
      enter-active-class="transition-all ease-out duration-300"
      leave-active-class="transition-all ease-in duration-200"
      enter-from-class="opacity-0 translate-y-2 translate-x-4"
      enter-to-class="opacity-100 translate-y-0 translate-x-0"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'rounded-lg shadow-lg px-4 py-3 flex items-center pointer-events-auto max-w-md',
          {
            'bg-green-100 border-l-4 border-green-500': toast.type === 'success',
            'bg-danger bg-opacity-10 border-l-4 border-danger': toast.type === 'error',
            'bg-primary bg-opacity-10 border-l-4 border-primary': toast.type === 'info',
            'bg-warning bg-opacity-10 border-l-4 border-warning': toast.type === 'warning'
          }
        ]"
      >
        <div class="flex-shrink-0 mr-3">
          <svg v-if="toast.type === 'success'" class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          
          <svg v-if="toast.type === 'error'" class="h-5 w-5 text-danger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          
          <svg v-if="toast.type === 'info'" class="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          
          <svg v-if="toast.type === 'warning'" class="h-5 w-5 text-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <div class="flex-1 pr-6">
          <p class="text-sm">{{ toast.message }}</p>
        </div>
        
        <button @click="removeToast(toast.id)" class="text-gray-500 hover:text-gray-800 focus:outline-none">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration: number;
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

const addToast = (message: string, type: 'success' | 'error' | 'info' | 'warning', duration = 3000) => {
  const id = nextId++;
  const toast = { id, message, type, duration };
  toasts.value.push(toast);
  
  setTimeout(() => {
    removeToast(id);
  }, duration);
};

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
};

// Expose methods to parent
defineExpose({
  success: (message: string, duration?: number) => addToast(message, 'success', duration),
  error: (message: string, duration?: number) => addToast(message, 'error', duration),
  info: (message: string, duration?: number) => addToast(message, 'info', duration),
  warning: (message: string, duration?: number) => addToast(message, 'warning', duration),
});
</script>