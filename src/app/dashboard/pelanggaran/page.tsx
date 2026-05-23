'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter, X, Search, Loader2 } from 'lucide-react';
import { supabase, mapViolation, mapSiswa } from '@/lib/supabaseClient';
import PelanggaranTable from '@/components/pelanggaran/PelanggaranTable';
import AddPelanggaranDialog from '@/components/pelanggaran/AddPelanggaranDialog';
import EditPelanggaranDialog from '@/components/pelanggaran/EditPelanggaranDialog';
import PelanggaranFilters from '@/components/pelanggaran/FilterTable';
import ExportTable from '@/components/pelanggaran/ExportTable';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Pelanggaran, Siswa } from '@/types';

export default function PelanggaranPage() {
    const [violations, setViolations] = useState<Pelanggaran[]>([]);
    const [students, setStudents] = useState<Siswa[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [pageSize, setPageSize] = useState(5);

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "",
        severity: "",
        violationType: "",
    });

    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedViolation, setSelectedViolation] = useState<Pelanggaran | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const response = await fetch('/api/violations');
            const result = await response.json();
            if (!result.success) throw new Error(result.error);
            setViolations((result.data || []).map(mapViolation));

            const { data: siswaData, error: siswaError } = await supabase
                .from('siswas')
                .select('*, kelas(*)');

            if (siswaError) throw siswaError;
            setStudents((siswaData || []).map(mapSiswa));

        } catch (error) {
            console.error("Error fetching violations:", error);
            alert("Gagal memuat data pelanggaran.");
        } finally {
            setLoading(false);
        }
    }

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            startDate: "",
            endDate: "",
            status: "",
            severity: "",
            violationType: "",
        });
    };

    const filterOptions = useMemo(() => {
        const types = Array.from(new Set(violations.map(v => v.jenis_pelanggaran).filter(Boolean)));
        return {
            types,
            severities: ['Ringan', 'Sedang', 'Berat'],
            statuses: ['Aktif', 'Selesai'],
        };
    }, [violations]);

    const filteredViolations = useMemo(() => {
        return violations.filter(v => {
            if (search) {
                const q = search.toLowerCase();
                const matchSearch =
                    v.siswa?.nama?.toLowerCase().includes(q) ||
                    v.siswa?.nis?.toLowerCase().includes(q) ||
                    v.siswa?.kelas?.kelas?.toLowerCase().includes(q) ||
                    v.jenis_pelanggaran?.toLowerCase().includes(q) ||
                    v.deskripsi?.toLowerCase().includes(q) ||
                    v.status?.toLowerCase().includes(q) ||
                    v.tingkat?.toLowerCase().includes(q);
                if (!matchSearch) return false;
            }

            if (filters.startDate && v.tanggal < filters.startDate) return false;
            if (filters.endDate && v.tanggal > filters.endDate) return false;
            if (filters.status && v.status !== filters.status) return false;
            if (filters.severity && v.tingkat !== filters.severity) return false;
            if (filters.violationType && v.jenis_pelanggaran !== filters.violationType) return false;

            return true;
        });
    }, [violations, search, filters]);

    const handleAdd = async (newViolationData: Omit<Pelanggaran, 'id' | 'created_at' | 'updated_at' | 'siswa' | 'dilaporkan_oleh'>) => {
        try {
            const response = await fetch('/api/violations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newViolationData),
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.error);

            if (result.data) {
                setViolations(prev => [mapViolation(result.data), ...prev]);
            }
        } catch (err) {
            console.error(err);
            alert("Gagal menambahkan data pelanggaran.");
        }
    };

    const handleEdit = (violation: Pelanggaran) => {
        setSelectedViolation(violation);
        setEditDialogOpen(true);
    };

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
                setViolations(prev => prev.map(v => v.id === updatedViolation.id ? mapViolation(result.data) : v));
            }

            setEditDialogOpen(false);
            setSelectedViolation(null);
        } catch (err) {
            console.error(err);
            alert("Gagal memperbarui data pelanggaran.");
        }
    };

    const handleDelete = async (id: any) => {
        try {
            const response = await fetch(`/api/violations?id=${id}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.error);

            setViolations(prev => prev.filter(v => v.id !== id));
        } catch (err) {
            console.error(err);
            alert("Gagal menghapus data pelanggaran.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-gray-500">Memuat data pelanggaran...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 bg-clip-text text-transparent">
                        Data Pelanggaran
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Kelola data pelanggaran siswa, pantau poin kedisiplinan, dan tindak lanjut laporan.
                    </p>
                </div>
            </div>

            <Card className="p-5 shadow-md border border-gray-100 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Cari nama, NIS, jenis pelanggaran..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400 rounded-lg text-sm w-full"
                            />
                        </div>
                        <Button
                            variant={showFilters ? "default" : "outline"}
                            size="default"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 h-10 px-4 rounded-lg font-medium text-sm transition-all"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                            {showFilters ? <X className="w-3.5 h-3.5 ml-0.5" /> : null}
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <ExportTable data={filteredViolations} />
                        
                        <AddPelanggaranDialog
                            open={addDialogOpen}
                            onOpenChange={setAddDialogOpen}
                            onAdd={handleAdd}
                            dataSiswa={students}
                        />

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Tampilkan:</span>
                            <Select value={String(pageSize)} onValueChange={(val) => setPageSize(Number(val))}>
                                <SelectTrigger className="w-16 h-10 border-gray-200 rounded-lg text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <PelanggaranFilters
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    filterOptions={filterOptions}
                    filteredCount={filteredViolations.length}
                    totalCount={violations.length}
                />

                <div className="mt-4">
                    <PelanggaranTable
                        violations={filteredViolations}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        pageSize={pageSize}
                    />
                </div>
            </Card>

            <EditPelanggaranDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                violation={selectedViolation}
                onUpdate={handleUpdate}
                dataSiswa={students}
                mode="violation"
            />
        </div>
    );
}