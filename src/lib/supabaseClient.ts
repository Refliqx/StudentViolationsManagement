import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function mapSiswa(s: any): any {
  if (!s) return s;
  return {
    ...s,
    kelas_id: s.id_kelas,
    tanggal_lahir: s.tgl_lahir,
    alamat: s.alamat || "Alamat tidak tersedia",
  };
}

export function mapViolation(v: any): any {
  if (!v) return v;
  const mappedSiswa = mapSiswa(v.siswas || v.siswa);
  const photoUrl = v.bukti_pelanggarans?.[0]?.url_foto || v.url || null;
  return {
    ...v,
    siswa_id: v.id_siswa,
    waktu: v.waktu || null,
    lokasi: v.lokasi || null,
    deskripsi: v.deskripsi || null,
    tindakan: v.tindakan || null,
    tanggal_tindak_lanjut: v.tanggal_tindak_lanjut || null,
    catatan: v.catatan || null,
    url: photoUrl,
    siswa: mappedSiswa,
    siswas: mappedSiswa,
    dilaporkan_oleh_user: v.dilaporkan_oleh_user || null
  };
}
