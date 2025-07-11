"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import { IRegisterResponse } from "@/lib/interface/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    referralCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setError(null);
    setIsLoading(true);
    try {
      const response = await axios.post<IRegisterResponse>(
        `${API_URL}/api/auth/register`,
        formData
      );
      setSuccessMessage(response.data.message);
      setFormData({ fullName: "", email: "", referralCode: "" });
    } catch (error: any) {
      if (error.isAxiosError && error.response) {
        setError(error.response.data.error || "Registrasi Gagal.");
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
        <div className="text-center">
          <Link href="/" className="text-green-600 font-bold text-3xl">
            FreshMart
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Atau{" "}
            <Link
              href="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              masuk ke akun Anda
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
          {successMessage && (
            <div className="mb-4 bg-green-50 p-4 rounded-md text-green-700">
              {successMessage}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
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
                htmlFor="referralCode"
                className="block text-sm font-medium text-gray-700"
              >
                Kode Referral (Opsional)
              </label>
              <div className="mt-1">
                <input
                  id="referralCode"
                  name="referralCode"
                  type="text"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black"
                />
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
                  "Daftar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
