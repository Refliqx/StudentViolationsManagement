'use client';

import { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter, DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import type { Pelanggaran, Siswa } from '@/types';
import { FormFieldsPelanggaran, type PelanggaranFormData } from "./FormFieldsPelanggaran";

interface EditPelanggaranDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    violation: Pelanggaran | null;
    onUpdate: (violation: Pelanggaran) => void;
    dataSiswa?: Siswa[];
    mode?: 'violation' | 'tindakan';
}

export default function EditPelanggaranDialog({
    open, onOpenChange, violation, onUpdate, dataSiswa = [], mode = 'violation'
}: EditPelanggaranDialogProps) {
    const [form, setForm] = useState<PelanggaranFormData>({
        siswa_id: 0,
        jenis_pelanggaran: '',
        tingkat: '',
        poin: 0,
        tanggal: '',
        waktu: '',
        lokasi: '',
        deskripsi: '',
        status: 'Aktif',
        tindakan: null,
        tanggal_tindak_lanjut: null,
        catatan: null,
        url: null,
    });

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (violation) {
            setForm({
                siswa_id: violation.siswa_id,
                jenis_pelanggaran: violation.jenis_pelanggaran,
                tingkat: violation.tingkat,
                poin: violation.poin,
                tanggal: violation.tanggal,
                waktu: violation.waktu,
                lokasi: violation.lokasi,
                deskripsi: violation.deskripsi,
                status: violation.status,
                tindakan: violation.tindakan || null,
                tanggal_tindak_lanjut: violation.tanggal_tindak_lanjut || null,
                catatan: violation.catatan || null,
                url: violation.url || null,
            });
            setSearchQuery(violation.siswa ? `${violation.siswa.nama} - ${violation.siswa.nis}` : "");
            setPreviewUrl(violation.url || "");
            setSelectedFile(null);
        }
    }, [violation]);

    const handleChange = <K extends keyof PelanggaranFormData>(key: K, value: PelanggaranFormData[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    const removeFile = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        setForm(prev => ({ ...prev, url: null }));
    };

    const handleSubmit = async () => {
        if (!violation) return;
        if (!form.siswa_id || form.siswa_id === 0) { alert("Silahkan pilih siswa"); return; }
        
        try {
            setUploading(true);
            let uploadedUrl = form.url;
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const response = await fetch('/api/upload', {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload file');
                }

                const result = await response.json();
                if (result.success) {
                    uploadedUrl = result.url;
                }
            }

            onUpdate({
                ...violation,
                ...form,
                url: uploadedUrl || null,
            });
            onOpenChange(false);
        } catch (err) {
            console.error('Error updating violation:', err);
            alert('Gagal memperbarui data. Silahkan coba lagi.');
        } finally {
            setUploading(false);
        }
    }

    if (!violation) return null;

    const isCreatingTindakan = !violation.tindakan;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-slate-800">
                        {mode === 'tindakan' 
                            ? (isCreatingTindakan ? 'Buat Tindakan & Sanksi' : 'Update Tindakan & Sanksi')
                            : 'Edit Laporan Pelanggaran'
                        }
                    </DialogTitle>
                </DialogHeader>

                <div className="py-2">
                    <FormFieldsPelanggaran
                        form={form}
                        onChange={handleChange}
                        dataSiswa={dataSiswa}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        previewUrl={previewUrl}
                        onFileChange={handleFileChange}
                        onRemoveFile={removeFile}
                        showSiswaField={mode === 'violation'}
                        showMainFields={mode === 'violation'}
                        showOptionalFields={true}
                        showFileUpload={mode === 'violation'}
                    />
                </div>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={uploading}>
                            Batal
                        </Button>
                    </DialogClose>

                    <Button
                        onClick={handleSubmit}
                        disabled={uploading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}