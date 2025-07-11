"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  updateProfileName,
  updateProfilePicture,
  clearError,
  fetchUserProfile,
} from "@/lib/redux/slice/authSlice";
import { IMessageResponse, IUser } from "@/lib/interface/auth";
import { LoaderIcon, UploadCloudIcon } from "lucide-react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const defaultAvatarSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='1.5'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

interface Props {
  user: IUser;
}

export default function PersonalInformation({ user }: Props) {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
    });
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSuccessMessage("");
      dispatch(clearError());
      const resultAction = await dispatch(updateProfilePicture(file));
      if (updateProfilePicture.fulfilled.match(resultAction)) {
        setSuccessMessage("Foto profil berhasil diperbarui.");
        dispatch(fetchUserProfile());
      }
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    dispatch(clearError());

    let nameUpdateSuccess = false;
    let emailUpdateSuccess = false;

    if (formData.fullName !== user.fullName) {
      const resultAction = await dispatch(
        updateProfileName({ fullName: formData.fullName })
      );
      if (updateProfileName.fulfilled.match(resultAction)) {
        nameUpdateSuccess = true;
      }
    } else {
      nameUpdateSuccess = true;
    }

    if (formData.email !== user.email) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post<IMessageResponse>(
          `${API_URL}/api/user/request-email-update`,
          { newEmail: formData.email },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessMessage(response.data.message);
        emailUpdateSuccess = true;
      } catch (error: any) {
        dispatch({
          type: "auth/update/rejected",
          payload:
            error.response?.data?.error || "Gagal meminta pembaruan email.",
        });
        emailUpdateSuccess = false;
      }
    } else {
      emailUpdateSuccess = true;
    }

    if (nameUpdateSuccess && emailUpdateSuccess) {
      await dispatch(fetchUserProfile());

      if (formData.email === user.email) {
        setSuccessMessage("Perubahan berhasil disimpan.");
      }
      setIsEditMode(false);
    }
  };

  const handleCancel = () => {
    setFormData({ fullName: user.fullName, email: user.email });
    setIsEditMode(false);
    dispatch(clearError());
  };

  return (
    <form onSubmit={handleSaveChanges} className="space-y-6">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div
          className="relative w-24 h-24"
          onClick={() => fileInputRef.current?.click()}
        >
          <Image
            src={user.profilePicture || defaultAvatarSvg}
            alt={user.fullName || "Default Avatar"}
            fill
            sizes="96px"
            className="rounded-full object-cover border-2 border-green-500 cursor-pointer"
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePictureChange}
          className="hidden"
          accept=".jpg, .jpeg, .png, .gif"
        />
        <p className="mt-2 text-sm text-gray-500">
          Click to change profile picture
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleFormChange}
            readOnly={!isEditMode}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              !isEditMode
                ? "bg-gray-100 text-gray-500"
                : "text-black border-gray-300"
            }`}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            readOnly={!isEditMode}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              !isEditMode
                ? "bg-gray-100 text-gray-500"
                : "text-black border-gray-300"
            }`}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Referral Code
        </label>
        <input
          type="text"
          value={user.referralCode || "N/A"}
          readOnly
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
        />
      </div>

      <div className="pt-4 flex justify-end">
        {isEditMode ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-medium hover:bg-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium flex items-center disabled:opacity-50 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderIcon className="animate-spin h-5 w-5 mr-2" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium cursor-pointer"
          >
            Edit Profile
          </button>
        )}
      </div>
    </form>
  );
}
