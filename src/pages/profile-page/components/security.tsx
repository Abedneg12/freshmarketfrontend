"use client";

import React, { use, useState } from "react";
import axios from "axios";
import { IUser, IMessageResponse } from "@/lib/interface/auth";
import {
  LoaderIcon,
  AlertCircleIcon,
  InfoIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { apiUrl } from "@/pages/config";

interface SecurityProps {
  user: IUser | null;
}

export default function Security({ user }: SecurityProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const isPasswordUser = !!user?.hashPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccessMessage("");
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    if (formData.newPassword.length < 6) {
      setError("Password baru minimal harus 6 karakter.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${apiUrl}/api/user/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(
        (response.data as IMessageResponse).message ||
          "Password berhasil diperbarui!"
      );
      setIsEditMode(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal memperbarui password.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setError(null);
    setSuccessMessage("");
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (!isPasswordUser) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start">
        <InfoIcon className="h-6 w-6 mr-3 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-semibold">
            Anda login menggunakan Akun Sosial
          </h3>
          <p className="text-sm">
            Fitur ubah kata sandi tidak tersedia untuk akun yang terhubung
            dengan penyedia layanan sosial. Untuk mengubah kata sandi, silakan
            lakukan melalui halaman pengaturan akun sosial Anda.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveChanges} className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Ubah Password</h3>

      {error && (
        <div className="bg-red-50 p-3 rounded-md text-red-700 text-sm flex items-center">
          <AlertCircleIcon className="h-5 w-5 mr-2" /> {error}
        </div>
      )}
      {successMessage && !isEditMode && (
        <div className="bg-green-50 p-3 rounded-md text-green-700 text-sm flex items-center">
          <ShieldCheckIcon className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password Saat Ini
        </label>
        <input
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          readOnly={!isEditMode}
          required
          className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-black ${
            !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Password Baru
        </label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          readOnly={!isEditMode}
          required
          minLength={6}
          className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-black ${
            !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Konfirmasi Password Baru
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          readOnly={!isEditMode}
          required
          className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-black ${
            !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        />
      </div>

      <div className="flex justify-end gap-4">
        {isEditMode ? (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? (
                <LoaderIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Simpan Password"
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
          >
            Ubah Password
          </button>
        )}
      </div>
    </form>
  );
}
