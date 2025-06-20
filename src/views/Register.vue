<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1 class="text-xl font-bold text-center text-primary">Funtatoz</h1>
        <p class="text-sm text-center text-gray-600">Silahkan register karyawan mu untuk masuk ke dashboard</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <FormInput 
          v-model="username" 
          label="Username" 
          type="text" 
          placeholder="Masukkan username"
        />
        
        <FormInput 
          v-model="password" 
          label="Password" 
          type="password" 
          placeholder="Masukkan password"
        />
        
        <Button 
          type="submit" 
          class="w-full mt-4"
          :loading="loading"
        >
          Register
        </Button>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth.store';
import FormInput from '@/components/ui/FormInput.vue';
import Button from '@/components/ui/Button.vue';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<String>("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";
  
  try {
    await authStore.register(username.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = "Username Atau Password Salah"
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
</style>
