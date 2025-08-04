"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LoaderIcon, AlertCircleIcon } from "lucide-react";
import axios from "axios";
import { IMessageResponse } from "@/lib/interface/auth";
import { apiUrl } from "@/config";

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const referralCode = searchParams?.get("ref");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [refCode, setRefCode] = useState(referralCode || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axios.post<IMessageResponse>(
        `${apiUrl}/api/auth/register`,
        {
          fullName,
          email,
          referralCode: refCode,
        }
      );
      setSuccessMessage(response.data.message);
      setIsRegistrationSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Terjadi kesalahan saat mendaftar."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      const response = await axios.post<IMessageResponse>(
        `${apiUrl}/api/auth/resend-verification`,
        { email }
      );
      setSuccessMessage(response.data.message);
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal mengirim ulang email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="text-green-600 font-bold text-3xl">
          FreshMart
        </Link>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Buat Akun Baru
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md text-red-700 flex items-center">
              <AlertCircleIcon className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 bg-green-50 p-4 rounded-md text-green-700">
              {successMessage}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  readOnly={isRegistrationSuccess}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-black ${
                    isRegistrationSuccess && "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Alamat Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={isRegistrationSuccess}
                  required
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-black ${
                    isRegistrationSuccess && "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kode Referral (Opsional)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                  readOnly={isRegistrationSuccess}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-black ${
                    isRegistrationSuccess && "bg-gray-100 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            <div>
              {isRegistrationSuccess ? (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border rounded-full text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoaderIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    "Kirim Ulang Verifikasi"
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border rounded-full text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <LoaderIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    "Daftar"
                  )}
                </button>
              )}
            </div>
          </form>

          {isRegistrationSuccess && (
            <p className="mt-4 text-center text-sm text-gray-600">
              Klik tombol "Kirim Ulang" jika tidak menerima email.
            </p>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Atau lanjut dengan
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() =>
                  (window.location.href = `${apiUrl}/api/oauth/google`)
                }
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 56.6l-58.2 57.2C336.7 86.6 295.6 72 248 72c-78.2 0-141.6 63.4-141.6 141.6S169.8 399.2 248 399.2c83.8 0 122.3-61.4 125.2-90.4H248v-68.8h239.1c1.3 12.8 2.2 25.8 2.2 39.4z"
                  ></path>
                </svg>
                <span className="ml-2">Daftar dengan Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
