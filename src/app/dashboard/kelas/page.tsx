'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import KelasTable from "@/components/kelas/KelasTable";
import AddKelasDialog from "@/components/kelas/AddKelasDialog";
import EditKelasDialog from "@/components/kelas/EditKelasDialog";
import { Kelas } from "@/types";
import { Loader2 } from "lucide-react";

type KelasFormData = { kelas: string; };

const initialFormData: KelasFormData = { kelas: "" };

export default function KelasPage() {
    const [kelas, setKelas] = useState<Kelas[]>([]);
    const [addForm, setAddForm] = useState<KelasFormData>(initialFormData);
    const [editForm, setEditForm] = useState<KelasFormData>(initialFormData);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchKelas();
    }, []);

    const fetchKelas = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('kelas')
                .select('*')
                .order('kelas', { ascending: true });

            if (error) {
                throw error;
            }

            setKelas(data || []);
        } catch (error) {
            console.error("Failed to fetch kelas: ", error);
            alert("Gagal memuat data kelas.");
        } finally {
            setLoading(false);
        }
    }

    const handleAddChange = (key: string, value: string) => {
        setAddForm(prev => ({ ...prev, [key]: value }));
    }

    const handleEditChange = (key: string, value: string) => {
        setEditForm(prev => ({ ...prev, [key]: value }));
    }

    const handleAddDialogOpen = (open: boolean) => {
        setAddDialogOpen(open);
        if (!open) setAddForm(initialFormData);
    };

    const handleEditDialogOpen = (open: boolean) => {
        setEditDialogOpen(open);
        if (!open) {
            setEditForm(initialFormData);
            setEditingId(null);
        }
    }

    const handleAdd = async () => {
        try {
            if (!addForm.kelas.trim()) {
                alert("Nama kelas tidak boleh kosong");
                return;
            }

            const { data, error } = await supabase
                .from('kelas')
                .insert([{ kelas: addForm.kelas.trim() }])
                .select();

            if (error) {
                throw error;
            }

            if (data && data[0]) {
                setKelas((prev) => [...prev, data[0]]);
            }

            setAddDialogOpen(false);
            setAddForm(initialFormData);

        } catch (err) {
            console.error("Unexpected error:", err);
            alert("Gagal menambahkan kelas. Silakan coba lagi.");
        } 
    }

    const handleEditClick = (item: Kelas) => {
        setEditingId(item.id);
        setEditForm({ kelas: item.kelas });
        setEditDialogOpen(true);
    }

    const handleUpdate = async () => {
        try {
            if (editingId === null) return;

            if (!editForm.kelas.trim()) {
                alert("Nama kelas tidak boleh kosong");
                return;
            }

            const { error } = await supabase
                .from('kelas')
                .update({ kelas: editForm.kelas.trim() })
                .eq('id', editingId);

            if (error) {
                throw error;
            }

            setKelas((prev) => prev.map((k) => k.id === editingId ? { ...k, kelas: editForm.kelas.trim() } : k));

            setEditDialogOpen(false);
            setEditingId(null);
            setEditForm(initialFormData);
        } catch (err) {
            console.error("Unexpected error: ", err);
            alert("Gagal mengubah data kelas.");
        }
    }

    const handleDelete = async (id: number) => {
        try {
            const { error } = await supabase
                .from('kelas')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            setKelas((prev) => prev.filter((k) => k.id !== id));
        } catch (err) {
            console.error("Unexpected error: ", err);
            alert("Gagal menghapus kelas.");
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-gray-500">Memuat data kelas...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Data Kelas</h1>

            <Card className="p-4 shadow text-center">
                <KelasTable
                    data={kelas}
                    handleEditClick={handleEditClick}
                    handleDelete={handleDelete}
                    addDialog={
                        <AddKelasDialog
                            open={addDialogOpen}
                            setOpen={handleAddDialogOpen}
                            form={addForm}
                            handleChange={handleAddChange}
                            handleAdd={handleAdd}
                        />
                    }
                />
                <EditKelasDialog
                    open={editDialogOpen}
                    setOpen={handleEditDialogOpen}
                    form={editForm}
                    handleChange={handleEditChange}
                    handleUpdate={handleUpdate}
                />
            </Card>
        </div>
    );
}