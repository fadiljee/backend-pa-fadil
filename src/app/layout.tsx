import type { Metadata, Viewport } from "next";
import { Open_Sans, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#C1121F",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  title: "SMPN 1 Merawang | Website Profil Resmi Sekolah",
  description:
    "Website profil resmi SMPN 1 Merawang, Kecamatan Merawang, Kabupaten Bangka. Informasi profil sekolah, kegiatan siswa, galeri dokumentasi, berita, dan pengumuman akademik.",
  openGraph: {
    title: "SMPN 1 Merawang | Website Profil Resmi Sekolah",
    description:
      "Website profil resmi SMPN 1 Merawang, Kecamatan Merawang, Kabupaten Bangka. Informasi profil sekolah, kegiatan siswa, galeri dokumentasi, berita, dan pengumuman akademik.",
    type: "website",
    locale: "id_ID",
    images: [{ url: "/images/hero-smpn1-merawang.webp", width: 1200, height: 543 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SMPN 1 Merawang | Website Profil Resmi Sekolah",
    description:
      "Website profil resmi SMPN 1 Merawang, Kecamatan Merawang, Kabupaten Bangka.",
    images: ["/images/hero-smpn1-merawang.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${poppins.variable} ${openSans.variable}`}>
      <body className="min-h-dvh overflow-x-hidden bg-surface font-sans text-body antialiased">
        {children}
      </body>
    </html>
  );
}
