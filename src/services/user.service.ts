import type { User } from "@/types/users.type";
import axios from "axios";

const BASE_URL = "https://lxfdqogabjuhpltkjmww.supabase.co/rest/v1/users";
const API_KEY = `${import.meta.env.VITE_APP_SUPABASE_API_KEY}`;

export default class UserService {
  private api = axios.create({
    baseURL: BASE_URL, // ✅ fetch ke https://lxfd...supabase.co/rest/v1/users
    headers: {
      apiKey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  /**
   * Cari pengguna berdasarkan username dengan eq.username
   */
  async login(username: string, password: string): Promise<User> {
    console.log("[UserService:login] 💡 Dipanggil", { username });

    try {
      const params = {
        username: `eq.${username}`, // ✅ Perbaikan penyertaan eq.
      };

      const response = await this.api.get("", { params }); // ✅ pakai this.api, bukan axios

        const matchedUser = response.data[0];

        if (matchedUser.password !== password) {
          console.warn("[UserService:login] × Sandi salah");
          console.log(matchedUser)
          throw new Error("Sandi tidak sesuai.");
        }

        console.log("[UserService:login] ✓ Login berhasil", {
          username: matchedUser.username,
          password: matchedUser.password
        });
        return matchedUser;

      console.warn("[UserService:login] × Tidak cocok");
      throw new Error("Pengguna tidak ditemukan.");
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message;

      // ❗ Log error lengkap untuk dibaca
      console.error("[UserService:login] ✗ Gagal", {
        status,
        message,
        error,
      });

      throw error;
    }
  }

  /**
   * Registrasi pengguna baru
   *
   * ❗ Butuh pengecekan duplikasi username sebelum disimpan
   */
  async register(username: string, password: string): Promise<boolean> {
    console.log("[UserService:register] 💡 Dipanggil", { username });

    if (!username || !password) {
      console.warn("[UserService:register] × Input kosong");
      throw new Error("Username dan sandi harus diisi.");
    }

    try {

      // 2. Daftarkan user baru
      const response = await this.api.post("", {
        username: username,
        password: password,
      });


        console.log("[UserService:register] ✓ Berhasil");
        return true;
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message || error?.message || "error";

      console.error("[UserService:register] ✗ Gagal", {
        status,
        message,
        error,
      });

      throw error;
    }
  }
}