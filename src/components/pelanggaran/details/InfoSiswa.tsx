'use client';

import { Card } from '@/components/ui/card';
import { FileText, User, Calendar, MapPin, Award } from 'lucide-react';
import type { Siswa } from '@/types';

interface InfoSiswaProps {
    siswa?: Siswa;
    poin: number;
}

export default function InfoSiswa({ siswa, poin }: InfoSiswaProps) {
    const initialName = siswa?.nama
        ? siswa.nama
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    return (
        <Card className="overflow-hidden border border-gray-100 shadow-md bg-white transition-all duration-300 hover:shadow-lg">
            <div className="relative h-28 bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-end justify-center">
                <div className="absolute -bottom-10 w-20 h-20 rounded-full border-4 border-white bg-indigo-50 shadow-md flex items-center justify-center text-xl font-bold text-indigo-700 tracking-wider">
                    {initialName}
                </div>
            </div>
            <div className="pt-14 pb-6 px-6 text-center space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{siswa?.nama || 'Siswa Tidak Dikenal'}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">NIS: {siswa?.nis || '-'}</p>
                </div>

                <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-100 px-4 py-1.5 rounded-full text-xs font-semibold shadow-inner">
                    <Award className="w-4 h-4" />
                    <span>Akumulasi Poin: {poin} Poin</span>
                </div>

                <hr className="border-gray-100" />

                <div className="space-y-3.5 text-left text-sm">
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Kelas</p>
                            <p className="font-semibold text-gray-800">{siswa?.kelas?.kelas || '-'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                            <User className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Jenis Kelamin</p>
                            <p className="font-semibold text-gray-800">{siswa?.jenis_kelamin || '-'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Tanggal Lahir</p>
                            <p className="font-semibold text-gray-800">
                                {siswa?.tanggal_lahir 
                                    ? new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) 
                                    : '-'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Alamat</p>
                            <p className="font-medium text-gray-700 line-clamp-2 leading-relaxed">{siswa?.alamat || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
