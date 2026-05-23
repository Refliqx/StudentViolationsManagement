'use client';

import React from "react";
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Calendar } from "lucide-react";

const COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"];

export default function BirthYearDistribution({ data }: { data: any[] }) {
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const total = sortedData.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        Distribusi Tahun Kelahiran Siswa
                        <Badge variant="outline" className="hidden sm:inline-flex">
                            {sortedData.length} Tahun
                        </Badge>
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex justify-center">
                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ 
                                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                                        border: "none",
                                        borderRadius: "12px",
                                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
                                    }}
                                />
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Jumlah Siswa">
                                    {sortedData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-2 border-t border-slate-100/60 pt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">Detail Distribusi</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {sortedData.map((item, idx) => {
                                const percentage = total ? ((item.count / total) * 100).toFixed(1) : "0";
                                return (
                                    <div key={item.year} className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 border border-slate-100">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                            <span className="font-semibold text-gray-700">{item.year}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="secondary" className="font-semibold">{item.count} Siswa</Badge>
                                            <span className="text-xs text-muted-foreground w-10 text-right">{percentage}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
