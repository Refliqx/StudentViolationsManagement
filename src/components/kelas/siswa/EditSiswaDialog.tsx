'use client';

import { DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, DialogClose, Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import FormFields from "@/components/layout/FormFields";

export default function EditSiswaDialog({ open, setOpen, data, handleChange, handleAdd, handleUpdate, dataKelas }: any) {
    const onSave = handleUpdate || handleAdd;
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Siswa</DialogTitle>
                    <DialogDescription>
                        Silakan masukkan data siswa yang ingin diedit.
                    </DialogDescription>
                </DialogHeader>
                <FormFields data={data} onChange={handleChange} kelas={dataKelas} />
                <DialogFooter className="flex justify-end gap-2"> 
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button className="bg-yellow-500 text-white" onClick={onSave}>
                        Simpan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}