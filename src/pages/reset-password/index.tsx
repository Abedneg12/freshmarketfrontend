"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { IMessageResponse } from "@/lib/interface/auth";
import { LoaderIcon, Lock, ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPassword() {
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
      setError("Token reset tidak ditemukan atau tidak valid.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password minimal harus 6 karakter.");
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
          `${API_URL}/api/auth/reset-password/confirm`,
          { token, password }
        );
        setSuccessMessage(
          `${response.data.message}. Anda akan diarahkan ke halaman login...`
        );
        setTimeout(() => router.push("/login"), 3000);
      } catch (error: any) {
        if (error.isAxiosError && error.response) {
          setError(error.response.data.error || "Gagal mereset password.");
        } else {
          setError("Terjadi kesalahan. Silahkan coba lagi.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="text-green-600 font-bold text-3xl">
          FreshMart
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Create a New Password
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your new password below to reset your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-8 shadow-lg rounded-lg">
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-md">
              {successMessage}
            </div>
          )}

          {token && !successMessage ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-black"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-black"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-green-500 hover:bg-green-600 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoaderIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center text-gray-600">
              <p>Token tidak valid atau sudah digunakan.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-green-600 flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
