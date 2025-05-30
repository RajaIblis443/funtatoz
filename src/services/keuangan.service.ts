import axios, { type AxiosInstance } from "axios";
import { generateUUID } from "../utils/uuid";
import type Keuangan from "../types/keuangan.type";

const _BASE_URL = 'https://lxfdqogabjuhpltkjmww.supabase.co/rest/v1/keuangan';

export default class KeuanganService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: _BASE_URL,
      headers: {
        'apiKey': import.meta.env.VITE_APP_SUPABASE_API_KEY || '',
        'Authorization': `Bearer ${import.meta.env.VITE_APP_SUPABASE_API_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async getKeuangan() { 
    try {
      console.log('Fetching keuangan data...');
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
        console.error("Error fetching keuangan:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data
        });
      } else {
        console.error("Error fetching keuangan:", error);
      }
      throw error;
    }
  }

  async addTransaksi(keuangan: Keuangan) {
    try {
      const modifiedKeuangan: Keuangan = {
        tanggal: keuangan.tanggal,
        tipe: keuangan.tipe,
        nominal: keuangan.nominal,
        keterangan: keuangan.keterangan,
      }
      const response = await this.api.post('', keuangan);
      return response.data;
    }
    catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error adding transaction:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data
        });
      } else {
        console.error("Error adding transaction:", error);
      }
      throw error;
    }
  }

  async updateTransaksi(keuangan: Keuangan) { 
    try {
      const modifiedKeuangan: Keuangan = {
        tipe: keuangan.tipe,
        nominal: keuangan.nominal,
        keterangan: keuangan.keterangan,
        tanggal: keuangan.tanggal,
      }
      const response = await this.api.post('', keuangan, {
        params: { id: `eq.${keuangan.id}` }
      });
      return response.data;
    } catch (error) {
      // Enhanced error logging
      if (axios.isAxiosError(error)) {
        console.error("Error updating keuangan:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data
        });
      } else {
        console.error("Error updating keuangan:", error);
      }
      throw error;
    }
  }
  
  async deleteTransaksi(id: number) { 
    try {
      const response = await this.api.post('', { id }, {
        params: { id: `eq.${id}` },
      });
      return response.data;
    } catch (error) {
      // Enhanced error logging
      if (axios.isAxiosError(error)) {
        console.error("Error deleting keuangan:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data
        });
      } else {
        console.error("Error deleting keuangan:", error);
      }
      throw error;
    }
  }
}