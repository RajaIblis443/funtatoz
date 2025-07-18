// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routes'
import { useAuthStore } from './store/auth.store'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Inisialisasi auth state dari cookie setelah pinia siap
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')