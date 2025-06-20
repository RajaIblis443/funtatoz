<script setup lang="ts">
import AppLayout from './components/AppLayout.vue';
import LoadingOverlay from './components/ui/LoadingOverlay.vue';
import ToastNotification from './components/ui/ToastNotification.vue';
import { useLoadingStore } from './store/loading.store';
import { provide, ref } from 'vue';

const loadingStore = useLoadingStore();
const toast = ref();

// Provide toast instance to be accessible throughout the app
provide('toast', {
  success: (message: string, duration?: number) => toast.value?.success(message, duration),
  error: (message: string, duration?: number) => toast.value?.error(message, duration),
  info: (message: string, duration?: number) => toast.value?.info(message, duration),
  warning: (message: string, duration?: number) => toast.value?.warning(message, duration),
});
</script>

<template>
  <router-view />
  <LoadingOverlay :show="loadingStore.isLoading" :message="loadingStore.message" />
  <ToastNotification ref="toast" />
</template>

<style>
/* Base transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Scale transitions */
.scale-enter-active, .scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.scale-enter-from, .scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

/* Slide transitions */
.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(10px);
  opacity: 0;
}

/* List transitions */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
