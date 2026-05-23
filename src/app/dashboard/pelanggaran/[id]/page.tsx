'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
    ArrowLeft, 
    AlertTriangle, 
    Loader2, 
    FileText, 
    Award, 
    Calendar, 
    MapPin, 
    Camera, 
    Edit, 
    Download,
    User,
    Eye,
    Check,
    Plus
} from 'lucide-react';
import { supabase, mapViolation, mapSiswa } from '@/lib/supabaseClient';
import type { Pelanggaran, Siswa } from '@/types';
import EditPelanggaranDialog from '@/components/pelanggaran/EditPelanggaranDialog';
import jsPDF from 'jspdf';

export default function PelanggaranDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const [violation, setViolation] = useState<Pelanggaran | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [students, setStudents] = useState<Siswa[]>([]);

    useEffect(() => {
        const fetchUserDataAndStudents = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setCurrentUser(user);

                const { data: siswaData, error: siswaError } = await supabase
                    .from('siswas')
                    .select('*, kelas(*)');
                if (siswaError) throw siswaError;
                setStudents((siswaData || []).map(mapSiswa));
            } catch (err) {
                console.error("Error fetching context data:", err);
            }
        };
        fetchUserDataAndStudents();
    }, []);

    useEffect(() => {
        if (!id) return;
        const fetchViolation = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/violations?id=${id}`);
                const result = await response.json();
                if (!result.success) throw new Error(result.error);
                setViolation(mapViolation(result.data) || null);
            } catch (error) {
                console.error("Error fetching violation:", error);
                setViolation(null);
            } finally {
                setLoading(false);
            }
        };
        fetchViolation();
    }, [id]);

    const handleUpdate = async (updatedViolation: Pelanggaran) => {
        try {
            const response = await fetch('/api/violations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedViolation),
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.error);

            if (result.data) {
                setViolation(mapViolation(result.data));
            }
        } catch (err) {
            console.error("Error updating violation:", err);
            const errMsg = err instanceof Error ? err.message : String(err);
            alert("Gagal memperbarui data pelanggaran: " + errMsg);
        }
    };

    const handleMarkAsCompleted = async () => {
        if (!violation) return;
        try {
            const response = await fetch('/api/violations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: violation.id,
                    siswa_id: violation.siswa_id,
                    jenis_pelanggaran: violation.jenis_pelanggaran,
                    tingkat: violation.tingkat,
                    poin: violation.poin,
                    tanggal: violation.tanggal,
                    status: 'Selesai',
                }),
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.error);

            if (result.data) {
                setViolation(mapViolation(result.data));
                alert("Pelanggaran berhasil ditandai selesai.");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Gagal memperbarui status pelanggaran.");
        }
    };

    const handleDownload = async (url: string | null | undefined, filename: string) => {
        if (!url) return;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Gagal mengunduh berkas:", error);
            window.open(url, '_blank');
        }
    };

    const exportSingleToPDF = () => {
        if (!violation) return;
        const doc = new jsPDF();
        
        // KOP SURAT (School Letterhead Header)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text("SMK NEGERI 1 JENANGAN", 105, 20, { align: "center" });
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(71, 85, 105); // Slate-600
        doc.text("Jl. Jenderal Sudirman No. 1, Ponorogo, Jawa Timur", 105, 25, { align: "center" });
        doc.text("Email: info@smkn1jenangan.sch.id | Telp: (0352) 123456", 105, 30, { align: "center" });
        
        doc.setDrawColor(29, 78, 216); // Blue-700
        doc.setLineWidth(0.8);
        doc.line(15, 33, 195, 33);
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.setLineWidth(0.2);
        doc.line(15, 34.2, 195, 34.2);
        
        let y = 45;
        
        // Document Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59); // Slate-800
        doc.text("LAPORAN DETAIL PELANGGARAN KEDISIPLINAN SISWA", 105, y, { align: "center" });
        y += 6;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139); // Slate-500
        doc.text(`Nomor Laporan: PEL-2026-${String(violation.id).padStart(4, '0')}`, 105, y, { align: "center" });
        y += 12;

        // Section I: DATA SISWA
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(29, 78, 216); // Blue-700
        doc.text("I. INFORMASI DATA SISWA", 15, y);
        y += 4;
        
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.setLineWidth(0.3);
        doc.line(15, y, 195, y);
        y += 6;

        // Key-Value rows for Data Siswa
        const siswaInfo = [
            { label: "Nama Siswa", value: violation.siswa?.nama || "-" },
            { label: "Nomor Induk Siswa (NIS)", value: violation.siswa?.nis || "-" },
            { label: "Kelas / Rombel", value: violation.siswa?.kelas?.kelas || "-" },
            { label: "Jenis Kelamin", value: violation.siswa?.jenis_kelamin || "-" }
        ];

        doc.setFontSize(9.5);
        siswaInfo.forEach(item => {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(71, 85, 105); // Slate-600
            doc.text(item.label, 20, y);
            
            doc.setFont("helvetica", "normal");
            doc.setTextColor(30, 41, 59); // Slate-800
            doc.text(`:   ${item.value}`, 65, y);
            y += 7;
        });
        y += 3;

        // Section II: DETAIL KEJADIAN
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(29, 78, 216); // Blue-700
        doc.text("II. DETAIL KEJADIAN PELANGGARAN", 15, y);
        y += 4;
        
        doc.setDrawColor(226, 232, 240);
        doc.line(15, y, 195, y);
        y += 6;

        // Key-Value rows for Detail Kejadian
        const kejadianInfo = [
            { label: "Jenis Pelanggaran", value: violation.jenis_pelanggaran || "-" },
            { label: "Tingkat Pelanggaran", value: violation.tingkat || "-" },
            { label: "Bobot Poin", value: `${violation.poin} Poin` },
            { label: "Tanggal & Waktu", value: `${violation.tanggal ? new Date(violation.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}  pukul  ${violation.waktu || "-"}` },
            { label: "Lokasi Kejadian", value: violation.lokasi || "-" },
        ];

        kejadianInfo.forEach(item => {
            doc.setFont("helvetica", "bold");
            doc.setTextColor(71, 85, 105);
            doc.text(item.label, 20, y);
            
            doc.setFont("helvetica", "normal");
            doc.setTextColor(30, 41, 59);
            doc.text(`:   ${item.value}`, 65, y);
            y += 7;
        });

        // Long Description row (needs height calculation)
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Deskripsi Kejadian", 20, y);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(":", 65, y);
        
        const descText = violation.deskripsi || "Tidak ada deskripsi rinci.";
        const splitDesc = doc.splitTextToSize(descText, 125);
        doc.text(splitDesc, 69, y);
        
        y += (splitDesc.length * 5) + 4;

        // Section III: TINDAKAN DAN TINDAK LANJUT
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(29, 78, 216);
        doc.text("III. TINDAKAN DAN TINDAK LANJUT", 15, y);
        y += 4;
        
        doc.setDrawColor(226, 232, 240);
        doc.line(15, y, 195, y);
        y += 6;

        // Sanksi/Tindakan
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Sanksi / Tindakan", 20, y);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(`:   ${violation.tindakan || "Belum ada tindakan sanksi formal"}`, 65, y);
        y += 7;

        // Tanggal Tindak Lanjut
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Tanggal Tindak Lanjut", 20, y);
        
        const tglTindak = violation.tanggal_tindak_lanjut 
            ? new Date(violation.tanggal_tindak_lanjut).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
            : "Belum ditentukan";
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(`:   ${tglTindak}`, 65, y);
        y += 7;

        // Catatan Khusus
        doc.setFont("helvetica", "bold");
        doc.setTextColor(71, 85, 105);
        doc.text("Catatan Khusus", 20, y);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(":", 65, y);
        
        const notesText = violation.catatan || "Tidak ada catatan tambahan.";
        const splitNotes = doc.splitTextToSize(notesText, 125);
        doc.text(splitNotes, 69, y);
        
        y += (splitNotes.length * 5) + 12;

        // Signature Section
        if (y > 225) {
            doc.addPage();
            y = 30;
        }

        doc.setFontSize(9.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text("Ponorogo, " + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 140, y);
        y += 8;
        
        doc.text("Orang Tua / Wali Siswa,", 25, y);
        doc.text("Guru Bimbingan Konseling (BK),", 130, y);
        
        y += 28;
        doc.setDrawColor(148, 163, 184); // Slate-400
        doc.setLineWidth(0.5);
        doc.line(20, y, 70, y);
        doc.line(125, y, 185, y);
        
        y += 4;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text("( Nama Terang & Tanda Tangan )", 23, y);
        doc.text("( Nama Terang & Tanda Tangan )", 128, y);
        
        doc.save(`Laporan_Pelanggaran_${violation.siswa?.nama?.replace(/\s+/g, '_')}_${violation.id}.pdf`);
    };

    const getSeverityBadgeClass = (severity: string) => {
        switch (severity) {
            case 'Ringan':
                return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50';
            case 'Sedang':
                return 'bg-amber-50 text-amber-700 hover:bg-amber-50';
            case 'Berat':
                return 'bg-rose-50 text-rose-700 hover:bg-rose-50';
            default:
                return 'bg-gray-50 text-gray-700 hover:bg-gray-50';
        }
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'Selesai':
                return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50';
            case 'Aktif':
                return 'bg-orange-50 text-orange-700 hover:bg-orange-50';
            default:
                return 'bg-gray-50 text-gray-700 hover:bg-gray-50';
        }
    };

    const formatTimestamp = (timestampString: string) => {
        if (!timestampString) return "-";
        try {
            const date = new Date(timestampString);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            const ss = String(date.getSeconds()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
        } catch (e) {
            return timestampString;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-gray-500">Memuat rincian laporan...</span>
                </div>
            </div>
        );
    }

    if (!violation) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-sm">
                    <AlertTriangle className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Tidak Ditemukan</h1>
                    <p className="text-gray-500 mt-2 max-w-md">
                        Maaf, data pelanggaran dengan ID #{id} tidak ditemukan atau telah dihapus dari sistem.
                    </p>
                </div>
                <Button 
                    onClick={() => router.push('/dashboard/pelanggaran')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Daftar Pelanggaran
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto pb-12">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/pelanggaran">
                    <Button variant="outline" className="flex items-center gap-2 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 h-9 px-3 rounded-lg text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Detail Pelanggaran</h1>
            </div>

            <Card className="p-6 border border-gray-100 shadow-sm bg-white rounded-2xl space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-tight">{violation.siswa?.nama}</h2>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">NIS: {violation.siswa?.nis}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={`border-0 px-3.5 py-1 text-xs font-semibold rounded-full shadow-sm ${getSeverityBadgeClass(violation.tingkat)}`}>
                            {violation.tingkat}
                        </Badge>
                        <Badge className={`border-0 px-3.5 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusBadgeClass(violation.status)}`}>
                            {violation.status}
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-6 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                            <p className="text-xs text-gray-400 font-medium">Jenis Pelanggaran</p>
                            <p className="text-sm font-semibold text-blue-600 leading-tight">
                                {violation.jenis_pelanggaran}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Award className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                            <p className="text-xs text-gray-400 font-medium">Poin Pelanggaran</p>
                            <p className="text-sm font-bold text-red-600 leading-tight">
                                {violation.poin} poin
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                            <p className="text-xs text-gray-400 font-medium">Tanggal & Waktu</p>
                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                                {violation.tanggal} | {violation.waktu}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div className="space-y-0.5">
                            <p className="text-xs text-gray-400 font-medium">Lokasi</p>
                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                                {violation.lokasi || '-'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-5">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Deskripsi Kejadian</p>
                        <p className="text-sm font-medium text-gray-700 mt-2 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100/50">
                            {violation.deskripsi || '-'}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400 font-medium">Dilaporkan oleh</p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">
                            {currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || violation.dilaporkan_oleh_user?.name || 'Administrator'}
                        </p>
                    </div>
                </div>
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm bg-white rounded-2xl">
                <h2 className="text-base font-bold text-blue-800 flex items-center gap-2 mb-4">
                    <Camera className="w-5 h-5 text-blue-600" />
                    Bukti Pelanggaran
                </h2>
                
                {violation.url ? (
                    <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50/50 rounded-xl gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={violation.url}
                                alt={`Bukti Pelanggaran`}
                                className="w-24 h-16 sm:w-28 sm:h-20 object-cover rounded-lg border border-gray-100 shadow-sm shrink-0 bg-white"
                            />
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-sm font-semibold text-gray-850">Foto Bukti Pelanggaran</h3>
                                <p className="text-xs text-gray-500">
                                    Diunggah oleh: <span className="font-semibold text-gray-600">{currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || violation.dilaporkan_oleh_user?.name || "BagusHidayat21"}</span>
                                </p>
                                <p className="text-[10px] text-gray-400 font-medium font-mono mt-0.5">
                                    {formatTimestamp(violation.created_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 shrink-0">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => violation.url && window.open(violation.url, '_blank')}
                                className="flex items-center gap-1.5 text-xs border-gray-200 h-8 px-3 rounded-lg text-gray-600 font-medium hover:bg-gray-50 bg-white shadow-sm"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                Lihat
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDownload(violation.url, `bukti_pelanggaran_${violation.id}`)}
                                className="flex items-center gap-1.5 text-xs border-gray-200 h-8 px-3 rounded-lg text-gray-600 font-medium hover:bg-gray-50 bg-white shadow-sm"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Unduh
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 border border-dashed border-gray-200 bg-gray-50/50 rounded-xl space-y-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <Camera className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-medium text-gray-400">Belum ada bukti yang diunggah</p>
                    </div>
                )}
            </Card>

            <Card className="p-6 border border-gray-100 shadow-sm bg-white rounded-2xl space-y-6">
                <h2 className="text-base font-bold text-blue-800">Tindakan yang Diambil</h2>
                
                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Sanksi/Tindakan</p>
                        <p className={`text-sm font-semibold mt-1 ${violation.tindakan ? 'text-gray-800' : 'text-gray-400 italic font-normal'}`}>
                            {violation.tindakan || 'Belum ada tindakan yang diambil'}
                        </p>
                    </div>
                    
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Tanggal Tindak Lanjut</p>
                        <p className={`text-sm font-semibold mt-1 ${violation.tanggal_tindak_lanjut ? 'text-gray-800' : 'text-gray-400 italic font-normal'}`}>
                            {violation.tanggal_tindak_lanjut 
                                ? new Date(violation.tanggal_tindak_lanjut).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                : 'Belum ditentukan'}
                        </p>
                    </div>
                    
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Catatan</p>
                        <p className={`text-sm font-semibold mt-1 ${violation.catatan ? 'text-gray-800' : 'text-gray-400 italic font-normal'}`}>
                            {violation.catatan || 'Tidak ada catatan tambahan'}
                        </p>
                    </div>
                </div>

                <div className="pt-2 border-t border-gray-50 flex justify-start">
                    <Button
                        onClick={() => setIsEditDialogOpen(true)}
                        className={`font-medium flex items-center gap-2 rounded-lg px-4 h-9 shadow-sm text-white ${
                            !violation.tindakan 
                                ? 'bg-blue-600 hover:bg-blue-700' 
                                : 'bg-slate-700 hover:bg-slate-800'
                        }`}
                    >
                        {!violation.tindakan ? <Plus className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        {!violation.tindakan ? 'Buat Tindakan' : 'Update Tindakan'}
                    </Button>
                </div>
            </Card>

            <div className="space-y-3">
                <Button
                    onClick={exportSingleToPDF}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center justify-center gap-2 rounded-xl py-6 text-base shadow-sm transition-all duration-200"
                >
                    <Download className="w-5 h-5" />
                    Download Laporan (PDF)
                </Button>

                {violation.status !== 'Selesai' && (
                    <Button
                        onClick={handleMarkAsCompleted}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center gap-2 rounded-xl py-6 text-base shadow-sm transition-all duration-200"
                    >
                        <Check className="w-5 h-5" />
                        Tandai Pelanggaran Selesai
                    </Button>
                )}
            </div>

            <EditPelanggaranDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                violation={violation}
                onUpdate={handleUpdate}
                dataSiswa={students}
                mode="tindakan"
            />
        </div>
    );
}