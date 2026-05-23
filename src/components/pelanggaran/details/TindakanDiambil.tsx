'use client';

import { Card } from '@/components/ui/card';
import { CalendarCheck, Calendar, AlertCircle, UserCheck } from 'lucide-react';

interface TindakanDiambilProps {
    id: number;
    tindakan?: string | null;
    tanggal_tindak_lanjut?: string | null;
    catatan?: string | null;
}

export default function TindakanDiambil({
    id,
    tindakan,
    tanggal_tindak_lanjut,
    catatan
}: TindakanDiambilProps) {
    return (
        <Card className="p-6 border border-gray-100 shadow-md bg-white space-y-6 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-50 pb-4">
                <CalendarCheck className="w-5 h-5 text-emerald-600" />
                Tindakan & Tindak Lanjut
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tindakan Yang Diambil</span>
                    {tindakan ? (
                        <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-sm font-semibold text-emerald-800">
                            {tindakan}
                        </div>
                    ) : (
                        <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-sm font-semibold text-amber-800 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>Belum ada tindakan sanksi formal</span>
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal Tindak Lanjut</span>
                    <div className="flex items-center gap-2.5 p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                            {tanggal_tindak_lanjut 
                                ? new Date(tanggal_tindak_lanjut).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                                : 'Belum ditentukan'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Catatan Kedisiplinan / BK</span>
                <div className="p-4 bg-gray-50/70 border border-gray-100 rounded-xl text-sm text-gray-700 leading-relaxed font-medium">
                    {catatan || 'Tidak ada catatan tambahan yang dilaporkan oleh guru Bimbingan Konseling.'}
                </div>
            </div>

            <hr className="border-gray-50" />

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 font-medium">
                <div className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    <span>Pelapor: Staf BK / Guru Piket</span>
                </div>
                <div>
                    <span>ID Transaksi Pelanggaran: VIOL-BK-{String(id).padStart(4, '0')}</span>
                </div>
            </div>
        </Card>
    );
}
