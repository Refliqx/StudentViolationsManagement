'use client';

import { DialogContent, DialogDescription, DialogHeader, DialogFooter, DialogTitle, Dialog, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from '../ui/input';
import { Label } from '../ui/label'; 

export default function AddKelasDialog({ 
    open, setOpen, form, handleChange, handleAdd }: 
    { open: boolean; setOpen: (open: boolean) => void; form: {kelas: string}; handleChange: (key: string, value: string) => void; handleAdd: () => void; }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white">Tambah Kelas</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto w-full">
                <DialogHeader>
                    <DialogTitle>Tambah Kelas</DialogTitle>
                    <DialogDescription>
                        Silakan masukkan data kelas baru.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-2">
                    <Label htmlFor="kelas">Nama Kelas</Label>
                    <Input
                        id="kelas"
                        value={form.kelas}
                        onChange={(e) => handleChange('kelas', e.target.value)}
                        placeholder="Masukkan nama kelas"
                    />
                </div>
                <DialogFooter className="flex justify-end gap-2"> 
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button className="bg-blue-500 text-white" onClick={handleAdd}>
                        Tambah
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}