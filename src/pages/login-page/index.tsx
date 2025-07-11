"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { loginUser, clearError } from "@/lib/redux/slice/authSlice";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import axios from "axios";
import { IMessageResponse } from "@/lib/interface/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [resendSuccessMessage, setResendSuccessMessage] = useState("");
  const [resendError, setResendError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = sessionStorage.getItem("redirectUrl");
      sessionStorage.removeItem("redirectUrl");
      router.push(redirectUrl || "/profile");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResendSuccessMessage("");
    setResendError(null);
    dispatch(loginUser(formData));
  };

  const handleResendVerification = async () => {
    if (formData.email) {
      setIsResending(true);
      setResendError(null);
      setResendSuccessMessage("");
      try {
        const response = await axios.post<IMessageResponse>(
          `${API_URL}/auth/resend-verification`,
          { email: formData.email }
        );
        setResendSuccessMessage(response.data.message);
      } catch (error: any) {
        if (error.isAxiosError(error) && error.response) {
          setResendError(
            error.response.data.error || "Gagal mengirim ulang email."
          );
        } else {
          setResendError("Terjadi kesalahan. Silahkan coba lagi.");
        }
      } finally {
        setIsResending(false);
      }
    } else {
      setResendError(
        "Silahkan masukkan alamat email Anda di form terlebih dahulu."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="text-green-600 font-bold text-3xl">
            FreshMart
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Masuk ke Akun Anda
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Atau{" "}
            <Link
              href="/register"
              className="font-medium text-green-600 hover:text-green-500"
            >
              buat akun baru
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 p-4 rounded-md text-red-700 flex items-center">
              <AlertCircleIcon className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          {resendError && (
            <div className="mb-4 bg-red-50 p-4 rounded-md text-red-700 flex items-center">
              <AlertCircleIcon className="h-5 w-5 mr-2" />
              {resendError}
            </div>
          )}
          {resendSuccessMessage && (
            <div className="mb-4 bg-green-50 p-4 rounded-md text-green-700">
              {resendSuccessMessage}
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
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Lupa password?
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border rounded-full text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                ) : (
                  "Masuk"
                )}
              </button>
            </div>
          </form>

          {error?.includes("verifikasi") && (
            <div className="text-center mt-4">
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="text-sm font-medium text-green-600 hover:underline disabled:opacity-50"
              >
                {isResending ? "Mengirim..." : "Kirim ulang email verifikasi?"}
              </button>
            </div>
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
                  (window.location.href = `${API_URL}/api/oauth/google`)
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
                <span className="ml-2">Masuk dengan Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
