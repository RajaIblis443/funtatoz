<template>
  <Transition
    name="fade"
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 backdrop-blur-sm">
      <div class="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-3 transform transition-all duration-300 animate-in">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
        <p class="text-gray-700 text-lg font-medium">{{ message || 'Memproses...' }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.animate-in {
  animation: scaleIn 0.3s ease-out forwards;
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>