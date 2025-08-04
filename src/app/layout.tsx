import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import Navigation from "@/components/layout/Navigation";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Platform",
  description: "A video uploading and sharing platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <NextTopLoader color="#003366" showSpinner={false} />
          <Navigation />
          <main className="bg-[#eee]">{children}</main>
        </SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
