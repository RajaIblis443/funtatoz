<template>
  <div class="user-menu">
    <span class="username">{{ authStore.username }}</span>
    <button 
      @click="handleLogout"
      class="logout-btn"
      :disabled="loading"
    >
      {{ loading ? 'Logging out...' : 'Logout' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth.store';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

const handleLogout = async () => {
  loading.value = true;
  
  try {
    authStore.logout();
    // Redirect ke login
    router.push('/login');
  } catch (err) {
    console.error('Error during logout:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
  color: #374151;
}

.logout-btn {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.logout-btn:hover:not(:disabled) {
  background-color: #dc2626;
}

.logout-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>