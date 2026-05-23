'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card'; 
import { supabase, mapSiswa } from '@/lib/supabaseClient';
import SiswaTable from '@/components/siswa/SiswaTable';
import EditSiswaDialog from '@/components/siswa/EditSiswaDialog';
import { Siswa, Kelas } from '@/types';
import { Loader2 } from 'lucide-react';

type SiswaFormData = Omit<Siswa, "id" | "kelas">;

const initialFormData: SiswaFormData = {
    nama: "",
    nis: "",
    kelas_id: 0,
    jenis_kelamin: "",
    tanggal_lahir: "",
    alamat: "",
};

export default function SiswaPage() {
    const [dataSiswa, setDataSiswa] = useState<Siswa[]>([]);
    const [dataKelas, setDataKelas] = useState<Kelas[]>([]);
    const [selectedKelasId, setSelectedKelasId] = useState<number | null>(null);

    const [addData, setAddData] = useState<SiswaFormData>(initialFormData);
    const [editData, setEditData] = useState<SiswaFormData>(initialFormData);

    const [editingId, setEditingId] = useState<any>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: kelasData, error: kelasError } = await supabase
                .from('kelas')
                .select('*')
                .order('kelas', { ascending: true });

            if (kelasError) throw kelasError;
            setDataKelas(kelasData || []);

            const { data: siswaData, error: siswaError } = await supabase
                .from('siswas')
                .select('*, kelas(*)')
                .order('nama', { ascending: true });

            if (siswaError) throw siswaError;
            setDataSiswa((siswaData || []).map(mapSiswa));

        } catch (error) {
            console.error("Failed to fetch data:", error);
            alert("Gagal memuat data siswa.");
        } finally {
            setLoading(false);
        }
    }

    const handleAddChange = (key: string, value: string | number) => {
        setAddData((prev) => ({ ...prev, [key]: value }));
    }

    const handleEditChange = (key: string, value: string | number) => {
        setEditData((prev) => ({ ...prev, [key]: value }));
    }

    const handleAdd = async () => {
        try {
            if (!addData.nama.trim() || !addData.nis.trim() || !addData.kelas_id) {
                alert("Semua data wajib diisi dengan benar.");
                return;
            }

            const { data, error } = await supabase
                .from('siswas')
                .insert([{
                    nis: addData.nis.trim(),
                    nama: addData.nama.trim(),
                    id_kelas: addData.kelas_id,
                    jenis_kelamin: addData.jenis_kelamin === 'Laki-laki' || addData.jenis_kelamin === 'L' ? 'L' : 'P',
                    tgl_lahir: addData.tanggal_lahir,
                }])
                .select('*, kelas(*)');

            if (error) throw error;

            if (data && data[0]) {
                setDataSiswa((prev) => [...prev, mapSiswa(data[0])]);
            }

            setAddDialogOpen(false);
            setAddData(initialFormData);
        } catch (err) {
            console.error(err);
            alert("Gagal menambahkan siswa.");
        }
    }

    const handleEdit = (siswa: Siswa) => {
        setEditData({
            nama: siswa.nama,
            nis: siswa.nis,
            kelas_id: siswa.kelas_id,
            jenis_kelamin: siswa.jenis_kelamin === 'L' ? 'Laki-laki' : siswa.jenis_kelamin === 'P' ? 'Perempuan' : siswa.jenis_kelamin,
            tanggal_lahir: siswa.tanggal_lahir,
            alamat: siswa.alamat,
        });

        setEditingId(siswa.id);
        setEditDialogOpen(true);
    }

    const handleUpdate = async () => {
        if (!editingId) return;

        try {
            const { data, error } = await supabase
                .from('siswas')
                .update({
                    nis: editData.nis.trim(),
                    nama: editData.nama.trim(),
                    id_kelas: editData.kelas_id,
                    jenis_kelamin: editData.jenis_kelamin === 'Laki-laki' || editData.jenis_kelamin === 'L' ? 'L' : 'P',
                    tgl_lahir: editData.tanggal_lahir,
                })
                .eq('id', editingId)
                .select('*, kelas(*)');

            if (error) throw error;

            if (data && data[0]) {
                setDataSiswa((prev) => 
                    prev.map((s) => (s.id === editingId ? mapSiswa(data[0]) : s))
                );
            }

            setEditDialogOpen(false);
            setEditingId(null);
            setEditData(initialFormData);
        } catch (err) {
            console.error(err);
            alert("Gagal memperbarui data siswa.");
        }
    }

    const handleDelete = async (id: any) => {
        try {
            const { error } = await supabase
                .from('siswas')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setDataSiswa((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus siswa.");
        }
    }

    const handleAddDialogClose = (open: boolean) => {
        setAddDialogOpen(open);
        if (!open) setAddData(initialFormData);
    }

    const handleEditDialogClose = (open: boolean) => {
        setEditDialogOpen(open);
        if (!open) {
            setEditData(initialFormData);
            setEditingId(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-gray-500">Memuat data siswa...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Data Siswa</h1>
            <Card className="p-4">
                <SiswaTable
                    dataSiswa={dataSiswa}
                    dataKelas={dataKelas}
                    selectKelasId={selectedKelasId}
                    setSelectKelasId={setSelectedKelasId}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    addDialogOpen={addDialogOpen}
                    setAddDialogOpen={handleAddDialogClose}
                    data={addData}
                    handleChange={handleAddChange}
                    handleAdd={handleAdd}
                />
            </Card>

            <EditSiswaDialog
                open={editDialogOpen}
                setOpen={handleEditDialogClose}
                data={editData}
                handleChange={handleEditChange}
                handleUpdate={handleUpdate}
                dataKelas={dataKelas}
            />
        </div>
    );
}