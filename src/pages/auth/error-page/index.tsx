"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorMessage = decodeURIComponent(
    searchParams?.get("message") ||
      "Terjadi kesalahan yang tidak diketahui saat login."
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Login Gagal</h2>
        <p className="mt-2 text-sm text-gray-600 bg-red-50 p-3 rounded-md">
          {errorMessage}
        </p>
        <div className="mt-6">
          <Link
            href="/login"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            Kembali ke Halaman Login
          </Link>
        </div>
      </div>
    </div>
  );
}
