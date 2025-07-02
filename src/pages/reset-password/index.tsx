"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { confirmResetPassword, clearError } from "@/lib/redux/slice/authSlice";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = searchParams?.get("token");

  useEffect(() => {
    dispatch(clearError());
    if (!token) {
      setLocalError("Token reset tidak ditemukan atau tidak valid.");
    }
  }, [token, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    if (password !== confirmPassword) {
      setLocalError("Password tidak cocok.");
      return;
    }
    if (token) {
      const resultAction = await dispatch(
        confirmResetPassword({ token, password })
      );
      if (confirmResetPassword.fulfilled.match(resultAction)) {
        setSuccessMessage(
          `${resultAction.payload}. Anda akan diarahkan ke halaman login...`
        );
        setTimeout(() => router.push("/login"), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password Anda
        </h2>

        {localError && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">
            {localError}
          </div>
        )}
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
              <label className="block text-sm font-medium">Password Baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 border p-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full mt-1 border p-2 rounded-md"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-2 rounded-md disabled:opacity-50"
            >
              {isLoading ? "Menyimpan..." : "Reset Password"}
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
