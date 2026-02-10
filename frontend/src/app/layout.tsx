import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import ServerWaker from "./components/ServerWaker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DocuNexus",
  description: "AI-Powered Document Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServerWaker />
        {children}
       
        <Toaster />
      </body>
    </html>
  );
}