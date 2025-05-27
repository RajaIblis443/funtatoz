import axios, { type AxiosInstance } from "axios";
import type { Transaksi } from "../types/transaksi.type";
import { generateUUID } from "../utils/uuid";

const _BASE_URL = 'https://cors2.funtatoz.workers.dev?target=https://script.google.com/macros/s/AKfycbzMbD_o9ZYDGhm7L2y-cy30r78IoIWtChcaJB45_L3Si57emuemwDVHr386G35PRje56w/exec';

export default class TransaksiService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: _BASE_URL,
    });
  }

  async getTransaksi() { 
    try {
      console.log('Fetching transaksi data...');
      const response = await this.api.get('', {
        params: { sheet: 'transaksi' }
      });
      
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
      transaksi.id = generateUUID();
      const response = await this.api.post('', transaksi, {
        params: { sheet: 'transaksi', _method: 'POST' }
      });
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
        params: { sheet: 'transaksi', _method: 'PUT' }
      });
      return response.data;
    } catch (error) {
      console.error("Error updating transaction:", error);
      throw error;
    }
  }
  async deleteTransaksi(id: string) { 
    try {
      const response = await this.api.post('', { id }, {
        params: { sheet: 'transaksi', _method: 'DELETE' }
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
  }
}