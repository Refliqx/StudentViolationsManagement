'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    ShieldAlert,
    CheckCircle2,
    AlertCircle,
    MapPin,
    Clock,
    Image as ImageIcon,
    CameraOff,
    Award
} from 'lucide-react';

interface BuktiPelanggaranProps {
    jenis_pelanggaran: string;
    tingkat: string;
    poin: number;
    lokasi: string;
    tanggal: string;
    waktu: string;
    deskripsi: string;
    url?: string | null;
}

export default function BuktiPelanggaran({
    jenis_pelanggaran,
    tingkat,
    poin,
    lokasi,
    tanggal,
    waktu,
    deskripsi,
    url
}: BuktiPelanggaranProps) {
    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'Ringan':
                return (
                    <Badge className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ringan
                    </Badge>
                );
            case 'Sedang':
                return (
                    <Badge className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-3 py-1 text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 w-fit">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Sedang
                    </Badge>
                );
            case 'Berat':
                return (
                    <Badge className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1 text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 w-fit">
                        <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                        Berat
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 text-xs font-semibold rounded-full w-fit">
                        {severity}
                    </Badge>
                );
        }
    };

    return (
        <Card className="p-6 border border-gray-100 shadow-md bg-white space-y-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-blue-600" />
                    Rincian Pelanggaran
                </h2>
                {getSeverityBadge(tingkat)}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Jenis Pelanggaran</span>
                    <p className="text-base font-semibold text-gray-800">{jenis_pelanggaran}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bobot Sanksi</span>
                    <div className="flex items-center gap-1.5 text-rose-600 font-bold text-base">
                        <Award className="w-4.5 h-4.5" />
                        <span>+{poin} Poin Pelanggaran</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Lokasi Kejadian</p>
                        <p className="font-semibold text-gray-800">{lokasi || '-'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Clock className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium">Waktu Kejadian</p>
                        <p className="font-semibold text-gray-800">
                            {tanggal} &bull; {waktu} WIB
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Deskripsi Kejadian</span>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 leading-relaxed italic">
                    "{deskripsi || 'Tidak ada deskripsi rinci.'}"
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-gray-400" />
                    Bukti Foto Kejadian
                </span>
                
                {url ? (
                    <div className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-inner flex items-center justify-center max-h-[300px]">
                        <img
                            src={url}
                            alt={`Bukti ${jenis_pelanggaran}`}
                            className="object-contain max-h-[300px] w-full rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="bg-black/75 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                                Lampiran Bukti Foto
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-100 bg-gray-50/50 rounded-xl space-y-2.5">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                            <CameraOff className="w-5 h-5" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-semibold text-gray-500">Tidak Ada Bukti Foto</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">Siswa dilaporkan secara verbal atau bukti foto tidak diunggah.</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
