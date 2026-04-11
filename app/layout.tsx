import type { Metadata } from "next";
import { DM_Sans, Syne, Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "HireUps | AI Placement OS",
  description: "AI-powered placement intelligence platform for Tier 2 and Tier 3 engineering colleges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", dmSans.variable, syne.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-screen flex flex-col bg-rich-black text-foreground font-sans relative">
        <Navbar />
        <main className="flex-grow pt-4">
          {children}
        </main>
        <Footer />
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}/>
      </body>
    </html>
  );
}
