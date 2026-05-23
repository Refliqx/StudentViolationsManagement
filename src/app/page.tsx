'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Activity, FileText, LayoutDashboard, LogIn, GraduationCap, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const [session, setSession] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Premium Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-800 tracking-tight block">Manajemen Siswa</span>
              <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider block -mt-1">SMK Negeri 1 Malang</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {checkingAuth ? (
              <div className="w-24 h-9 bg-slate-100 animate-pulse rounded-xl" />
            ) : !session ? (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-sm font-semibold text-slate-600 hover:text-slate-850 transition px-3 py-2"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all"
                >
                  Register
                </Link>
              </>
            ) : (
              <Link 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transform hover:-translate-y-0.5 active:translate-y-0 transition flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full text-blue-600 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            Sistem Pemantauan Kedisiplinan Terintegrasi
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-800 tracking-tight leading-tight">
            Membangun Karakter Penting & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tertib Berprestasi</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
            Platform modern untuk pencatatan, pemantauan, dan pelaporan kedisiplinan siswa yang transparan, akurat, dan terintegrasi di SMK Negeri 1 Malang. Membimbing masa depan dengan integritas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {checkingAuth ? (
              <div className="w-48 h-14 bg-slate-200 animate-pulse rounded-2xl" />
            ) : session ? (
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                Buka Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link 
                href="/auth/login" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                Masuk Sekarang
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}

            {!checkingAuth && !session && (
              <Link 
                href="/auth/register" 
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-8 py-4 rounded-2xl shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5 text-slate-400" />
                Buat Akun Baru
              </Link>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-slate-200/80 max-w-2xl text-center sm:text-left">
            <div>
              <span className="text-2xl md:text-3xl font-black text-slate-800 block">100%</span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 block whitespace-nowrap">Akurat & Transparan</span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-black text-slate-800 block">Real-time</span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 block whitespace-nowrap">Notifikasi Instan</span>
            </div>
            <div>
              <span className="text-2xl md:text-3xl font-black text-slate-800 block">Digital</span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 block whitespace-nowrap">Bebas Kertas (Paperless)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Graphic Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/20 blur-3xl rounded-full" />
          <div className="relative bg-white border border-slate-100 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-slate-400 font-mono">Live Monitoring</span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Pelanggaran Ringan</span>
                    <span className="text-xs text-slate-500 block">Siswa terlambat</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">-5 Poin</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-800 block">Sanksi & Pembinaan</span>
                    <span className="text-xs text-slate-500 block">Surat peringatan dicetak</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">Selesai</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-semibold tracking-wider block uppercase">Total Poin Kedisiplinan</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">2,450</span>
                <span className="text-xs text-emerald-400 font-bold">▲ 12% bulan ini</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="bg-white border-t border-slate-100 py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4 max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Layanan & Fitur Unggulan</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Memudahkan guru BK, guru piket, wali kelas, dan pimpinan sekolah dalam mengelola kedisiplinan serta membentuk karakter positif siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800">Pencatatan Real-time</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Catat pelanggaran murid secara cepat di mana saja dan kapan saja, lengkap dengan unggah foto bukti langsung dari perangkat Anda.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-800">Poin Akurat & Adil</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Penghitungan skor kedisiplinan otomatis berdasarkan klasifikasi tingkat pelanggaran (Ringan, Sedang, Berat).
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-800">Statistik Dashboard</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Visualisasi grafik interaktif mengenai tren pelanggaran bulanan, klasifikasi jenis, serta komparasi tingkat disiplin per kelas.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-bold text-slate-800">Cetak Laporan PDF</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ekspor dokumen laporan resmi lengkap dengan kop sekolah formal, detail pelanggaran, dan kolom tanda tangan pengesahan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-bold text-slate-200 tracking-tight">
              Sistem Informasi Manajemen Siswa &copy; 2026. SMK Negeri 1 Malang.
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Dikembangkan oleh Tim IT SMKN 1 Malang untuk mewujudkan generasi disiplin berkarakter.
          </p>
        </div>
      </footer>
    </div>
  );
}