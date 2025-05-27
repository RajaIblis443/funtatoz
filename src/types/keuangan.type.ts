export default interface Keuangan { 
  id: number;
  tanggal: string | Date;
  tipe: 'masuk' | 'keluar';
  nominal: number;
  keterangan: string;
}