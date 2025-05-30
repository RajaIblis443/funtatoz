import axios, { type AxiosInstance } from "axios";
import type { Transaksi } from "../types/transaksi.type";
import { generateUUID } from "../utils/uuid";

const _BASE_URL = `https://lxfdqogabjuhpltkjmww.supabase.co/rest/v1/transaksi`;

export default class TransaksiService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: _BASE_URL,
      headers: {
        'apiKey': import.meta.env.VITE_APP_SUPABASE_API_KEY || '',
        'Authorization': `Bearer ${import.meta.env.VITE_APP_SUPABASE_API_KEY || ''}`,
        'Content-Type': 'application/json',
      }
    });
  }

  async getTransaksi() { 
    try {
      console.log('Fetching transaksi data...');
      const response = await this.api.get('');
      
      // Log entire response for debugging
      console.log('API Response:', response);
      console.log('Response data type:', typeof response.data);
      console.log('Response data:', response.data);
      

      if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) { 
      // Enhanced error logging
      if (axios.isAxiosError(error)) {
        console.error("Error fetching transaksi:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data
        });
      } else {
        console.error("Error fetching trasaksi:", error);
      }
      throw error;
    }
  }
  async addTransaksi(transaksi: Transaksi) {
    try {
      const modifiedTransaksi: Transaksi = {
        tanggal: transaksi.tanggal,
        kode_barang: transaksi.kode_barang,
        jumlah: transaksi.jumlah,
      }
      console.log('Data yang dikirim ke Supabase:', modifiedTransaksi);
      const response = await this.api.post('', modifiedTransaksi);
      return response.data;
    }
    catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  }
  async updateTransaksi(transaksi: Transaksi) { 
    try {
      const response = await this.api.post('', transaksi, {
        params: { id: `eq.${transaksi.id}`}
      });
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }
  async deleteTransaksi(id: number) { 
    try {
      const response = await this.api.delete('', { params: { id: `eq.${id}` } });
      return response.data;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
}