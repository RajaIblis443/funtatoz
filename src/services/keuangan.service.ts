import axios, { type AxiosInstance } from "axios";
import { generateUUID } from "../utils/uuid";
import type Keuangan from "../types/keuangan.type";

const _BASE_URL = 'https://cors2.funtatoz.workers.dev?target=https://script.google.com/macros/s/AKfycbzMbD_o9ZYDGhm7L2y-cy30r78IoIWtChcaJB45_L3Si57emuemwDVHr386G35PRje56w/exec';

export default class KeuanganService {
  private api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: _BASE_URL,
      // Increase timeout to 30 seconds (default is 0, which means no timeout)
      timeout: 30000,
    });
  }

  async getKeuangan() { 
    try {
      console.log('Fetching keuangan data...');
      const response = await this.api.get('', {
        params: { sheet: 'keuangan' }
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
      keuangan.id = generateUUID();
      const response = await this.api.post('', keuangan, {
        params: { sheet: 'keuangan', _method: 'POST' }
      });
      return response.data;
    }
    catch (error) {
      // Enhanced error logging
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
      const response = await this.api.post('', keuangan, {
        params: { sheet: 'keuangan', _method: 'PUT' }
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
  
  async deleteTransaksi(id: string) { 
    try {
      const response = await this.api.post('', { id }, {
        params: { sheet: 'keuangan', _method: 'DELETE' }
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