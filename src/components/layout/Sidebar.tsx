'use client';

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, Users, BarChart3, X, Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent } from "../ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                setUser(currentUser);
            } catch (err) {
                console.error("Gagal memuat data user di sidebar:", err);
            }
        };
        fetchUser();
    }, []);

    const menuItems = [
        { Label: "Dashboard", icon: Home, href: "/dashboard" },
        { Label: "Siswa", icon: Users, href: "/dashboard/siswa" },
        { Label: "Kelas", icon: BarChart3, href: "/dashboard/kelas" },
        { Label: "Pelanggaran", icon: BarChart3, href: "/dashboard/pelanggaran" },
    ];

    const SidebarContent =  () => (
        <div className="flex h-full flex-col bg-background">
            <div className="flex h-16 items-center justify-between px-6 border-b">
                <div className="flex items-center space-x-2 ">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="text-primary-foreground font-semibold text-sm">MS</span>
                    </div>
                    <h1 className="tracking-tight font-semibold text-lg">Manajemen Siswa</h1>
                </div>
                <Button variant="ghost" size="icon" className="lg:hidden w-8 h-8">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map(({ Label, icon: Icon, href }) => {
                        const isActive = href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive ? "bg-blue-600 text-primary-foreground shadow-sm"
                                             : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className="h-4 w-4" />
                                    <span>{Label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatar.png" alt="User Avatar" />
                            <AvatarFallback>
                                {(user?.user_metadata?.name || user?.email || "U").substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user?.user_metadata?.name || user?.email?.split('@')[0] || "User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email || "loading..."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    );

    return (
        <>
            <aside className="hidden lg:block lg:fixed lg:h-screen lg:left-0 lg:z-50 lg:w-64 lg:overflow-y-auto lg:border-r">
                <SidebarContent />
            </aside>

            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent side="left" className="w-64 p-0">
                    <SidebarContent />
                </SheetContent>
            </Sheet>
        </>
    );
}