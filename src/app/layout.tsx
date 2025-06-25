// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
=======
import StoreProvider from "@/component/storeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
>>>>>>> 0c05effc2d42caa3e442e5be78cba9b282740511

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freshmarket",
  description: "Belanja bahan pokok online dengan toko terdekat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </AuthProvider>
=======
    <html lang="id">
      <body className={inter.className}>
        <StoreProvider>
          {children}
          <ToastContainer />
        </StoreProvider>
>>>>>>> 0c05effc2d42caa3e442e5be78cba9b282740511
      </body>
    </html>
  );
}
