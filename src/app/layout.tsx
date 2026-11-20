import type { Metadata } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "SMPN 1 Merawang | Profil Sekolah & Berita Kegiatan",
  description:
    "Website profil resmi SMPN 1 Merawang, memuat profil sekolah, visi dan misi, berita kegiatan, materi pembelajaran, serta lokasi sekolah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${openSans.variable}`}>
      <body className="min-h-dvh overflow-x-clip font-sans antialiased">{children}</body>
    </html>
  );
}
