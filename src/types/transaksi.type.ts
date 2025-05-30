export interface Transaksi { 
  id?: number;
  tanggal: string | Date;
  kode_barang: number;
  jumlah: number;
  createdAt?: string | Date;
}
