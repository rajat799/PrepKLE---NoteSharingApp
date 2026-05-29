import type { Metadata } from "next";
import { DM_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/common/Header";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/common/Toast";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PrepKLE — Smart Notes for Smarter Engineers",
  description:
    "A student-powered notes sharing platform for KLE Dr. M.S. Sheshgiri College of Engineering, Belagavi. Share, discover, and excel with curated study materials.",
  keywords: ["PrepKLE", "KLE", "notes", "engineering", "Belagavi", "study materials"],
  openGraph: {
    title: "PrepKLE — Smart Notes for Smarter Engineers",
    description: "Student-powered notes hub for KLE Belagavi",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${caveat.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
