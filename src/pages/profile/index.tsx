"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchUserProfile,
  changePassword,
  logoutUser,
  clearError,
  updateProfileName,
  updateProfilePicture,
} from "@/lib/redux/slice/authSlice";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );
  const [fullName, setFullName] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(clearError())
    const token = localStorage.getItem("token");
    if (token) {
      if (!user) {
        dispatch(fetchUserProfile());
      } else {
        setFullName(user.fullName);
      }
    } else {
      router.push("/login");
    }
  }, [user, dispatch, router]);

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setSuccessMessage("");
    const resultAction = await dispatch(updateProfileName({ fullName }));
    if (updateProfileName.fulfilled.match(resultAction)) {
      setSuccessMessage("Nama berhasil diperbarui!");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    setSuccessMessage("");
    const resultAction = await dispatch(changePassword(passwordData));
    if (changePassword.fulfilled.match(resultAction)) {
      setSuccessMessage("Password berhasil diubah!");
      setPasswordData({ oldPassword: "", newPassword: "" });
    }
  };

  const handlePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      dispatch(clearError());
      setSuccessMessage("");
      const resultAction = await dispatch(updateProfilePicture(file));
      if (updateProfilePicture.fulfilled.match(resultAction)) {
        setSuccessMessage("Foto profil berhasil diperbarui!");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Profil Saya</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative w-24 h-24">
            <Image
              src={
                user.profilePicture ||
                `https://ui-avatars.com/api/?name=${user.fullName}&background=random&color=fff`
              }
              alt="Profile Picture"
              fill
              className="rounded-full object-cover border-2 border-green-500"
              sizes="96px"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-center sm:text-left">
              {user.fullName}
            </h2>
            <p className="text-gray-600 text-center sm:text-left">
              {user.email}
            </p>
            <p className="text-sm text-gray-500 mt-2 text-center sm:text-left">
              Kode Referral:{" "}
              <strong className="font-mono">{user.referralCode}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Keamanan</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 ">
              Password Lama
            </label>
            <input
              type="password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className="mt-1 w-full border p-2 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password Baru
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 w-full border p-2 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? "Mengubah..." : "Ubah Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
