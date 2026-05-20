export interface Pinjaman {
  id: number;
  anggota_id: number;
  anggota_nama?: string;
  nominal: number;
  margin_persen: number;
  tenor_bulan: number;
  angsuran_per_bulan?: number;
  status: string;
  created_at: string;
}

export interface Anggota {
  id: number;
  nama: string;
}
