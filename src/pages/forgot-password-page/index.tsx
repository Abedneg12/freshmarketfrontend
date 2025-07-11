"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { IMessageResponse } from "@/lib/interface/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post<IMessageResponse>(
        `${API_URL}/api/auth/reset-password`,
        { email }
      );
      setSuccessMessage(response.data.message);
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        setError(error.response.data.error || "Gagal meminta reset password.");
      } else {
        setError("Terjadi kesalahan. Silahkan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Lupa Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masukkan email Anda untuk menerima link reset password.
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-lg text-black"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-full disabled:opacity-50"
            >
              {isLoading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
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
    </div>
  );
}
