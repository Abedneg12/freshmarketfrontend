"use client";

import React, { use, useState } from "react";
import axios from "axios";
import { useAppSelector } from "@/lib/redux/hooks";
import { IUser, IMessageResponse } from "@/lib/interface/auth";
import { LoaderIcon } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  user: IUser & { hashPassword?: boolean };
}

export default function Security({ user }: Props) {
  const { coordinates } = useAppSelector((state) => state.location);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [createPasswordData, setCreatePasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      let endpoint = "";
      let payload = {};

      if (isCreateMode) {
        if (
          createPasswordData.newPassword !== createPasswordData.confirmPassword
        )
          throw new Error("Password baru tidak cocok.");
        endpoint = `${API_URL}/api/user/create-password`;
        payload = { password: createPasswordData.newPassword };
      } else {
        if (
          changePasswordData.newPassword !== changePasswordData.confirmPassword
        )
          throw new Error("Password baru tidak cocok.");
        endpoint = `${API_URL}/api/user/change-password`;
        payload = {
          oldPassword: changePasswordData.oldPassword,
          newPassword: changePasswordData.newPassword,
        };
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = isCreateMode
        ? await axios.post<IMessageResponse>(endpoint, payload, config)
        : await axios.patch<IMessageResponse>(endpoint, payload, config);
      setSuccess(response.data.message || "Password berhasil diganti.");
      handleCancel();
    } catch (error: any) {
      setError(
        error.response?.data?.error || error.message || "Terjadi kesalahan."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setIsCreateMode(false);
    setError(null);
    setSuccess("");
    setChangePasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setCreatePasswordData({ newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      {success && (
        <div className="p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Password</h3>

        {/* PENJELASAN: Logika utama untuk menampilkan UI yang sesuai. */}
        {user.hashPassword ? (
          // --- JIKA PENGGUNA PUNYA PASSWORD ---
          isEditMode ? (
            // Tampilkan form ubah password jika dalam mode edit
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-4 max-w-lg"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  onChange={(e) =>
                    setChangePasswordData({
                      ...changePasswordData,
                      oldPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  onChange={(e) =>
                    setChangePasswordData({
                      ...changePasswordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={(e) =>
                    setChangePasswordData({
                      ...changePasswordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // Tampilan awal untuk pengguna dengan password
            <div className="flex items-center justify-between max-w-lg">
              <p className="text-gray-600">
                Update your password for better security.
              </p>
              <button
                onClick={() => setIsEditMode(true)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium cursor-pointer"
              >
                Edit
              </button>
            </div>
          )
        ) : // --- JIKA PENGGUNA TIDAK PUNYA PASSWORD (LOGIN VIA GOOGLE) ---
        isCreateMode ? (
          // Tampilkan form buat password jika dalam mode create
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                onChange={(e) =>
                  setCreatePasswordData({
                    ...createPasswordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                onChange={(e) =>
                  setCreatePasswordData({
                    ...createPasswordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  "Create Password"
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          // Tampilan awal untuk pengguna Google
          <div className="flex items-center justify-between max-w-lg">
            <p className="text-gray-600">
              You are logged in with Google. Create a password to log in with
              email.
            </p>
            <button
              onClick={() => setIsCreateMode(true)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer"
            >
              Create Password
            </button>
          </div>
        )}
      </div>

      {/* --- Bagian Lokasi --- */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Current Location
        </h3>
        <p className="text-gray-600">
          This is the location used for this session to find the nearest stores.
        </p>
        <p className="text-sm text-gray-500 mt-1 font-mono">
          {coordinates
            ? `Lat: ${coordinates.lat.toFixed(
                4
              )}, Lng: ${coordinates.lng.toFixed(4)}`
            : "Location not available"}
        </p>
      </div>
    </div>
  );
}
