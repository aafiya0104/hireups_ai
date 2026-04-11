import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Toaster } from "react-hot-toast";

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
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans relative">
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
