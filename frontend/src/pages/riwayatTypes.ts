export interface Transaction {
  id: number;
  type: 'simpanan' | 'pinjaman' | 'angsuran' | 'funding';
  amount: number;
  date: string;
  status: string;
  description: string;
}

export interface CurrentUser {
  id: number;
  email: string;
  nama: string;
  role: string;
  status: string;
}

export interface SimpananData {
  id: number;
  nominal: number;
  created_at: string;
  status: string;
  jenis: string;
  anggota_id?: number;
}

export interface PinjamanData {
  id: number;
  nominal: number;
  created_at: string;
  status: string;
  tenor_bulan?: number;
  anggota_id?: number;
}

export interface AngsuranData {
  id: number;
  nominal_angsuran: number;
  tanggal_bayar: string | null;
  status: string;
  bulan_ke: number;
  anggota_id?: number;
}

export interface FundingData {
  id: number;
  nominal: number;
  created_at: string;
  status: string;
  tujuan_usaha: string;
  anggota_id?: number;
}
