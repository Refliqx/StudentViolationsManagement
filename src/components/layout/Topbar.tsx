'use client';

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOutIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { supabase } from "@/lib/supabaseClient";

export default function Topbar({ onMenuClick } : { onMenuClick: () => void }) {
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
                console.error("Gagal memuat data user:", err);
            }
        };
        fetchUser();
    }, []);

    const menuMap: Record<string, string> = {}

    const title = menuMap[pathname] || "SMK Negeri 1 Malang";

    const handleLogout = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            router.push("/auth/login");
        } catch (err) {
            console.error("Gagal logout:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={onMenuClick}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar>
                                    <AvatarImage src="/avatar.png" alt="User Avatar" />
                                    <AvatarFallback>
                                        {(user?.user_metadata?.name || user?.email || "U").substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none"> 
                                        {user?.user_metadata?.name || user?.email?.split('@')[0] || "User"}
                                    </p>
                                    <p className="text-sm leading-none text-muted-foreground">
                                        {user?.email || "loading..."}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={handleLogout}
                            >
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}