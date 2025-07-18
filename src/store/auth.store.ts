// src/store/auth.store.ts
import { defineStore } from 'pinia';
import { setAuthCookie, getAuthCookie, removeAuthCookie } from '../utils/util';
import UserService from '@/services/user.service';
import type { User } from '@/types/users.type';

interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

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
          console.log('✅ Login berhasil:', user.username);
        } else {
          this.error = 'Login gagal';
          throw new Error('Login gagal');
        }
      } catch (err: any) {
        this.error = err.message || 'Gagal login';
        console.error('❌ Login gagal:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async register(username: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const userService = new UserService();
        const success = await userService.register(username, password);

        if (success) {
          setAuthCookie(username); // Simpan username ke cookie
          this.username = username;
          this.isAuthenticated = true;
          console.log('✅ Registrasi berhasil:', username);
        } else {
          this.error = 'Registrasi gagal';
          throw new Error('Registrasi gagal');
        }
      } catch (err: any) {
        this.error = err.message || 'Gagal registrasi';
        console.error('❌ Registrasi gagal:', err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      removeAuthCookie(); // Hapus cookie
      this.username = null;
      this.isAuthenticated = false;
      this.error = null;
      console.log('🔓 Logout berhasil');
      
      // Redirect ke login (akan dilakukan di component)
      // Tidak bisa langsung pakai router di store karena bisa menyebabkan error
    },

    // Fungsi untuk inisialisasi state dari cookie (ketika refresh halaman)
    initializeAuth() {
      const savedUsername = getAuthCookie();
      if (savedUsername) {
        this.username = savedUsername;
        this.isAuthenticated = true;
        console.log('🔄 Auth state diinisialisasi:', savedUsername);
      }
    }
  }
});