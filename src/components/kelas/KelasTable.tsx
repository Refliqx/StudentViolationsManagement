'use client';

import { DataTable } from "../layout/Table";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger } from '../ui/dialog';
import ConfirmDeleteDialog from "../layout/DeleteDialog";
import { type ColumnDef } from "@tanstack/react-table";
import { Kelas } from "@/types";

export default function KelasTable({
    data,
    handleEditClick,
    handleDelete,
    addDialog,
}: {
    data: Kelas[];
    handleEditClick: (kelas: Kelas) => void;
    handleDelete: (id: number) => void;
    addDialog: React.ReactNode;
}) {
    const columns: ColumnDef<Kelas>[] = [
        {
            header: "No",
            cell: ({ row }: any) => <div className="text-center">{row.index + 1}</div>,
        },
        { 
            accessorKey: "kelas",
            header: "Nama",
        },
        {
            header: "Aksi",
            cell: ({ row }: any) => {
                const kelas: Kelas = row.original;
                return (
                    <div className="flex justify-center gap-2 items-center">
                        <Button onClick={() => handleEditClick(kelas)} className="bg-yellow-300">
                            Edit
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-red-500 text-white">Hapus</Button>
                            </DialogTrigger>
                            <ConfirmDeleteDialog onConfirm={() => handleDelete(kelas.id)} />
                        </Dialog>
                    </div>
                );
            }
        }
    ];

    return (
        <DataTable
            columns={columns}
            data={data}
            actions={addDialog}
        />
    );
}