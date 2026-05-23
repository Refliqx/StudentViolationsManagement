import type { Metadata } from "next";
import "./globals.css";

import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Manajemen Siswa",
  description: "Aplikasi manajemen siswa untuk kelas industri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout >{children}</ClientLayout>
      </body>
    </html>
  );
}
