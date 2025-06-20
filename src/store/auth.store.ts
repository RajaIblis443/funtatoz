import { defineStore } from 'pinia';
import { setAuthCookie, getAuthCookie, removeAuthCookie } from '../utils/util';
import UserService from '@/services/user.service';
import type { User } from '@/types/users.type'; // Pastikan import ini benar
import { useRoute, useRouter } from 'vue-router';

interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
const router = useRouter();

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    username: getAuthCookie(), // Ambil username dari cookie
    isAuthenticated: !!getAuthCookie(),
    loading: false,
    error: null,
  }),
  actions: {
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const userService = new UserService();
        const user = await userService.login(username, password);

        if (user && user.username) {
          setAuthCookie(user.username); // Simpan username ke cookie
          this.username = user.username;
          this.isAuthenticated = true;
        } else {
          this.error = 'Login gagal';
        }
      } catch (err) {
        this.error = String(err) || 'Gagal login';
      } finally {
        this.loading = false;
      }
    },

    async register(username: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const userService = new UserService();
        const user = await userService.register(username, password);

        if (user) {
          setAuthCookie(username); // Titik konsisten: kita gunakan username di cookie
          this.isAuthenticated = true;
        } else {
          this.error = 'Registrasi gagal';
        }
      } catch (err) {
        this.error = String(err) || 'Gagal registrasi';
      } finally {
        this.loading = false;
      }
    },

    logout() {
      removeAuthCookie(); // Hapus cookie
      this.username = null;
      this.isAuthenticated = false;
      router.push('/login');
    }
  }
});