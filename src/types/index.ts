export interface RegisterData {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterResponse { 
  status: boolean;
  message: string;
  data: RegisterData;
}

export interface LoginData {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: LoginData;
  token: string;
}

export interface DataPie {
  name: string;
  value: number;
  percent?: number;
}

export interface DataBar {
  nama_kelas: string;
  "Laki-Laki": number;
  Perempuan: number;
}

export interface DataTahunLahir {
  year: number;
  count: number;
}

export interface DataTrenPelanggaran {
  bulan: string;
  Aktif: number;
  Selesai: number;
}

export interface DataJenisPelanggaran {
  jenis_pelanggaran: string;
  total: number;
}

export interface DataTingkatPelanggaran {
  tingkat: string;
  total: number;
}

export interface DataTopPelanggar {
  kelas: string;
  total: number;
}

export interface ViolationStats {
  totalViolations: number;
  monthlyViolations: any[];
  violationTypes: any[];
  severityDistribution: any[];
  topViolators: any[];
}

export interface DataDashboard {
  totalSiswa: number;
  totalKelas: number;
  pie_data: DataPie[];
  bar_data: DataBar[];
  bar_data_birthyear: DataTahunLahir[];
  totalPelanggaran: number;
  pelanggaranTren: DataTrenPelanggaran[];
  pelanggaranPerJenis: DataJenisPelanggaran[];
  pelanggaranPerTingkat: DataTingkatPelanggaran[];
  pelanggaranPerKelas: DataTopPelanggar[];
}

export interface Kelas {
  id: number;
  kelas: string;
}

export interface KelasResponse {
  status: boolean;
  message: string;
  data: Kelas;
}

export interface Siswa {
  id: string | number;
  nis: string;
  nama: string;
  kelas_id: number;
  id_kelas?: number;
  jenis_kelamin: string;
  tanggal_lahir: string;
  tgl_lahir?: string;
  alamat: string;
  kelas?: Kelas;
}

export interface SiswaResponse {
  status: boolean;
  message: string;
  data: Siswa;
}

export interface Pelanggaran {
  id: string | number;
  siswa_id: string | number;
  id_siswa?: string | number;
  dilaporkan_oleh?: string | number | null;
  jenis_pelanggaran: string;
  tingkat: string;
  poin: number;
  tanggal: string;
  waktu: string;
  lokasi: string;
  deskripsi: string;
  status: string;
  tindakan?: string | null;
  tanggal_tindak_lanjut?: string | null;
  catatan?: string | null;
  created_at: string;
  updated_at?: string;
  url?: string | null;
  siswa?: Siswa;
  siswas?: Siswa;
  dilaporkan_oleh_user?: any;
  bukti_pelanggarans?: Array<{ id: string | number; id_pelanggaran: string; url_foto: string; created_at: string }>;
}

export interface EvidenceItem {
  id: number;
  pelanggaran_id: string | number;
  tipe: string;
  url: string;
  deskripsi: string;
  nama: string;
  diunggah_oleh: string;
  waktu_unggah: string;
  pelanggaran: Pelanggaran;
}

export interface PelanggaranResponse {
  status: boolean;
  message: string;
  data: Pelanggaran;
}

export interface GenericResponse<T> {
  status: boolean;
  message: string;
  data: T;
}