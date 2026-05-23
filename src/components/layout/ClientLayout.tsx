'use client';

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import AppLayout from "./AppLayout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const checkSession = async () => {
            const { data: { session: currentSession } } = await supabase.auth.getSession();
            if (isMounted) {
                setSession(currentSession);
                setLoading(false);
                
                if (!currentSession && pathname.startsWith("/dashboard")) {
                    router.push("/auth/login");
                } else if (currentSession && (pathname === "/auth/login" || pathname === "/auth/register" || pathname === "/")) {
                    router.push("/dashboard");
                }
            }
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (isMounted) {
                setSession(currentSession);
                setLoading(false);
                
                if (!currentSession && pathname.startsWith("/dashboard")) {
                    router.push("/auth/login");
                } else if (currentSession && (pathname === "/auth/login" || pathname === "/auth/register" || pathname === "/")) {
                    router.push("/dashboard");
                }
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-blue-800">Checking session...</span>
                </div>
            </div>
        );
    }

    const useLayoutPaths = [
        "/dashboard",
        "/dashboard/siswa",
        "/dashboard/kelas",
        "/dashboard/pelanggaran"
    ];

    const noLayoutPaths = [
        "/auth/login",
        "/auth/register"
    ];

    if (noLayoutPaths.includes(pathname)) return <>{children}</>;

    const useAppLayout = useLayoutPaths.some((p) => pathname.startsWith(p));

    if (useAppLayout) {
        if (!session) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm font-medium text-slate-600">Mengalihkan ke halaman login...</span>
                    </div>
                </div>
            );
        }
        return <AppLayout>{children}</AppLayout>;
    }

    return <>{children}</>;
}