import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb | Holiday rentals, cabins, beach houses & more",
  description: "Fullstack Airbnb web application clone built by Aarzu with Next.js, FastAPI, and SQLite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WishlistProvider>
            <SearchProvider>
              <Toaster position="bottom-center" reverseOrder={false} />
              <Navbar />
              <main className="min-h-screen pb-16 md:pb-0">{children}</main>
              <Footer />
              <MobileBottomNav />
            </SearchProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}