import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster"


const poppins = Poppins({ subsets: ["latin"], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  title: "AWS Handbook Frontend",
  description: "Frontend for AWS Handbook",
};


export default function RootLayout({ children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <Navbar />
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}

