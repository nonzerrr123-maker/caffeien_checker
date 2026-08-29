import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Caffeine Calculator - คำนวณคาเฟอีน",
  description: "เครื่องคำนวณระดับคาเฟอีนในกาแฟและชา พร้อมกราฟแสดงการเปลี่ยนแปลงของคาเฟอีนตามเวลา",
  keywords: ["caffeine", "calculator", "coffee", "tea", "matcha", "คาเฟอีน", "กาแฟ", "ชา", "มัทฉะ"],
  authors: [{ name: "Caffeine Calculator" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Caffeine Calculator - คำนวณคาเฟอีน",
    description: "คำนวณระดับคาเฟอีนในกาแฟและชา ดูกราฟและเวลาที่คาเฟอีนหมดฤทธิ์",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
