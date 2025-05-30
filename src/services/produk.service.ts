import axios, { type AxiosInstance } from "axios";
import { generateUUID } from "../utils/uuid";
import type { Produk } from "../types/produk.type";


const _BASE_URL = `https://lxfdqogabjuhpltkjmww.supabase.co/rest/v1/produk`;

export default class ProdukService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: _BASE_URL,
      headers: {
        'apiKey': import.meta.env.VITE_APP_SUPABASE_API_KEY || '',
        'Authorization': `${import.meta.env.VITE_APP_SUPABASE_API_KEY || ''}`,
        'Content-Type': 'application/json',
      }
    });
  }

  async getProduk() { 
    try {
      console.log('Fetching produk data...');
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
        console.error("Error fetching produk:", {
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

  async addProduk(produk: Produk) {
    try {
      const modifedProduk = { 'nama_barang' : produk.nama_barang, 'harga': produk.harga };
      console.log('Data yang dikirim ke Supabase:', modifedProduk);
      const response = await this.api.post('', modifedProduk);
      return response.data;
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding transaction:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data // <-- ini biasanya ada pesan error detail dari Supabase
        });
      } else {
        console.error("Error adding transaction:", error);
      }
      throw error;
    }
  }
  async updateProduk(produk: Produk) { 
    try {
      const modifedProduk = { 'nama_barang' : produk.nama_barang, 'harga': produk.harga };
      const response = await this.api.patch('', modifedProduk, {
        params: { id: `eq.${produk.id}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating produk:", error);
      throw error;
    }
  }
  async deleteProduk(id: number) { 
    try {
      const response = await this.api.delete('', {
        params: { id: `eq.${id}` }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting produk:", error);
      throw error;
    }
  }
}