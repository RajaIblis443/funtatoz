<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="text-xl font-bold text-center text-primary">Funtatoz</h1>
        <p class="text-sm text-center text-gray-600">Silahkan login untuk masuk ke dashboard</p>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <FormInput 
          v-model="username" 
          label="Username" 
          type="text" 
          placeholder="Masukkan username"
          :disabled="loading"
        />
        
        <FormInput 
          v-model="password" 
          label="Password" 
          type="password" 
          placeholder="Masukkan password"
          :disabled="loading"
        />
        
        <Button 
          type="submit" 
          class="w-full mt-4"
          :loading="loading"
          :disabled="loading || !username || !password"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </Button>
      </form>
      
      <!-- Link ke Register jika diperlukan -->
      <div class="text-center mt-4">
        <p class="text-sm text-gray-600">
          Belum punya akun? 
          <router-link to="/register" class="text-primary hover:underline">
            Daftar di sini
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth.store';
import FormInput from '@/components/ui/FormInput.vue';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string>("");

onMounted(() => {
  // Cek apakah user sudah login
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = "Username dan password harus diisi";
    return;
  }

  loading.value = true;
  error.value = "";
  
  try {
    await authStore.login(username.value, password.value);
    // Jika berhasil, redirect ke dashboard
    router.push('/');
  } catch (err: any) {
    error.value = err.message || "Username atau password salah";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9fafb;
}

.login-card {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-header {
  margin-bottom: 1.5rem;
}

.text-primary {
  color: #4F46E5;
}

.error-message {
  background-color: #fee2e2;
  border: 1px solid #f87171;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>