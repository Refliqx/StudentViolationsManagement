'use client';

import React, { useState, useEffect } from "react";
import { Users, GraduationCap, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { supabase, mapSiswa } from "@/lib/supabaseClient";

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import SiswaChart from "@/components/dashboard/SiswaChart";
import StatCard from "@/components/dashboard/StatCard";
import GenderRatioChart from "@/components/dashboard/GenderRatioChart";
import TrenPelanggaran from "@/components/dashboard/TrenPelanggaranChart";
import TipePelanggaran from "@/components/dashboard/TipePelanggaran";
import SeverityDistributionList from "@/components/dashboard/TingkatPelanggaran";
import TopViolatorsList from "@/components/dashboard/TopPelanggaran";
import BirthYearDistribution from "@/components/dashboard/BirthYearDistribution";

import { DataBar, DataTahunLahir, DataPie, ViolationStats } from "@/types";

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [totalSiswa, setTotalSiswa] = useState(0);
    const [totalKelas, setTotalKelas] = useState(0);
    const [barData, setBarData] = useState<DataBar[]>([]);
    const [pieData, setPieData] = useState<DataPie[]>([]);
    const [violationStats, setViolationStats] = useState<ViolationStats>({
        totalViolations: 0,
        monthlyViolations: [],
        violationTypes: [],
        severityDistribution: [],
        topViolators: [],
    });
    const [birthYearData, setBirthYearData] = useState<DataTahunLahir[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                const { count: siswaCount } = await supabase
                    .from('siswas')
                    .select('*', { count: 'exact', head: true });

                const { count: kelasCount } = await supabase
                    .from('kelas')
                    .select('*', { count: 'exact', head: true });

                const { data: students } = await supabase
                    .from('siswas')
                    .select('jenis_kelamin, tgl_lahir, kelas(kelas)');

                const violationsResponse = await fetch('/api/violations');
                const violationsResult = await violationsResponse.json();
                if (!violationsResult.success) throw new Error(violationsResult.error);
                const violations = violationsResult.data || [];

                setTotalSiswa(siswaCount || 0);
                setTotalKelas(kelasCount || 0);

                const classMap: Record<string, { male: number; female: number }> = {};
                let maleCount = 0;
                let femaleCount = 0;
                const yearMap: Record<number, number> = {};

                students?.forEach((s: any) => {
                    const className = s.kelas?.kelas || 'Unassigned';
                    if (!classMap[className]) {
                        classMap[className] = { male: 0, female: 0 };
                    }
                    if (s.jenis_kelamin === 'L' || s.jenis_kelamin === 'Laki-laki') {
                        classMap[className].male++;
                        maleCount++;
                    } else {
                        classMap[className].female++;
                        femaleCount++;
                    }

                    if (s.tgl_lahir) {
                        const year = new Date(s.tgl_lahir).getFullYear();
                        if (!isNaN(year)) {
                            yearMap[year] = (yearMap[year] || 0) + 1;
                        }
                    }
                });

                const compiledBarData = Object.keys(classMap).map(className => ({
                    nama_kelas: className,
                    "Laki-Laki": classMap[className].male,
                    Perempuan: classMap[className].female,
                }));

                const compiledPieData = [
                    { name: "Laki-Laki", value: maleCount },
                    { name: "Perempuan", value: femaleCount }
                ];

                const compiledBirthYear = Object.keys(yearMap).map(year => ({
                    year: Number(year),
                    count: yearMap[Number(year)],
                })).sort((a, b) => a.year - b.year);

                const monthMap: Record<string, { violations: number; resolved: number }> = {};
                const typeMap: Record<string, number> = {};
                let ringan = 0;
                let sedang = 0;
                let berat = 0;
                const violatorMap: Record<string, number> = {};

                violations?.forEach((v: any) => {
                    if (v.tanggal) {
                        const monthName = new Date(v.tanggal).toLocaleDateString('id-ID', { month: 'short' });
                        if (!monthMap[monthName]) {
                            monthMap[monthName] = { violations: 0, resolved: 0 };
                        }
                        monthMap[monthName].violations++;
                        if (v.status === 'Selesai') {
                            monthMap[monthName].resolved++;
                        }
                    }

                    const vType = v.jenis_pelanggaran || 'Lainnya';
                    typeMap[vType] = (typeMap[vType] || 0) + 1;

                    if (v.tingkat === 'Ringan') ringan++;
                    else if (v.tingkat === 'Sedang') sedang++;
                    else if (v.tingkat === 'Berat') berat++;

                    const studentName = v.siswas?.nama || v.siswa?.nama || 'Unknown';
                    violatorMap[studentName] = (violatorMap[studentName] || 0) + 1;
                });

                const compiledMonthly = Object.keys(monthMap).map(mName => ({
                    month: mName,
                    violations: monthMap[mName].violations,
                    resolved: monthMap[mName].resolved,
                }));

                const totalV = violations?.length || 0;
                const compiledTypes = Object.keys(typeMap).map((tName, idx) => ({
                    id: idx + 1,
                    type: tName,
                    count: typeMap[tName],
                    percentage: totalV ? parseFloat(((typeMap[tName] / totalV) * 100).toFixed(1)) : 0,
                })).sort((a, b) => b.count - a.count);

                const compiledSeverity = [
                    { severity: "Ringan", count: ringan, color: "#10b981" },
                    { severity: "Sedang", count: sedang, color: "#f59e0b" },
                    { severity: "Berat", count: berat, color: "#ef4444" },
                ];

                const compiledViolators = Object.keys(violatorMap).map(name => ({
                    name,
                    violations: violatorMap[name],
                })).sort((a, b) => b.violations - a.violations).slice(0, 5);

                setBarData(compiledBarData);
                setPieData(compiledPieData);
                setBirthYearData(compiledBirthYear);
                setViolationStats({
                    totalViolations: totalV,
                    monthlyViolations: compiledMonthly,
                    violationTypes: compiledTypes,
                    severityDistribution: compiledSeverity,
                    topViolators: compiledViolators,
                });

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="text-sm font-medium text-gray-500">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent ">Dashboard Siswa</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
                    <StatCard title="Siswa" value={totalSiswa} icon={Users} color="bg-blue-500" subtitle="Siswa Aktif" />
                    <StatCard title="Kelas" value={totalKelas} icon={GraduationCap} color="bg-green-500" subtitle="Kelas Aktif" />
                    <StatCard title="Rata-Rata per Kelas" value={totalKelas ? Math.round(totalSiswa / totalKelas) : 0} icon={TrendingUp} color="bg-amber-500" subtitle="Siswa per Kelas" />
                    <StatCard title="Pelanggaran" value={violationStats.totalViolations} icon={AlertTriangle} color="bg-red-500" subtitle="Total Pelanggaran" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <SiswaChart data={barData} />
                    <GenderRatioChart data={pieData} />
                    <TrenPelanggaran data={violationStats.monthlyViolations} />
                    <BirthYearDistribution data={birthYearData} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <TipePelanggaran data={violationStats.violationTypes} total={violationStats.totalViolations} />
                    <SeverityDistributionList data={violationStats.severityDistribution} />
                    <TopViolatorsList data={violationStats.topViolators} />
                </div>
            </div>
        </div>
    );
}