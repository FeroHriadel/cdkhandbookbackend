import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"
import GoBackButton from '@/components/GoBackButton';
import SearchButton from '@/components/SearchButton';


const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "ThisSite",
  description: "Showcase your items",
  openGraph: {
    title: "ThisSite",
    description: "Showcase your items",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ThisSite",
    locale: "en_US",
    type: "website",
    images: [{url: `${process.env.NEXT_PUBLIC_APP_URL}/images/logo.png`, width: 300, height: 300, alt: 'ThisSite'}]
  },
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL
  }
};


export default function RootLayout({ children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
            <GoBackButton className="fixed top-12 left-4 z-10" />
            <SearchButton className="fixed top-12 left-20 z-10" />
            {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}

