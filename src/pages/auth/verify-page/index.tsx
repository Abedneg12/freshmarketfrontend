"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { IMessageResponse } from "@/lib/interface/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = searchParams?.get("token");

  useEffect(() => {
    if (!token) {
      setError("Token verifikasi tidak ditemukan atau tidak valid.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password tidak cocok.");
      return;
    }
    if (token) {
      setIsLoading(true);
      try {
        const response = await axios.post<IMessageResponse>(
          `${API_URL}/api/auth/verify-email`,
          { token, password }
        );
        setSuccessMessage(
          `${response.data.message}. Anda akan diarahkan ke halaman Login...`
        );
        setTimeout(() => router.push("/login"), 3000);
      } catch (error: any) {
        if (error.isAxiosError && error.response) {
          setError(error.response.data.error || "Verifikasi gagal.");
        } else {
          setError("Terjadi kesalahan. Silahkan coba lagi.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Verifikasi Akun & Atur Password
        </h2>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">
            {successMessage}
          </div>
        )}

        {token && !successMessage && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Password Baru
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 border p-2 rounded-md text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 border p-2 rounded-md text-black"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? "Memverifikasi..." : "Verifikasi & Simpan Password"}
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <Link
            href="/login"
            className="text-sm text-green-600 hover:underline"
          >
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
