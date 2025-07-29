"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchProfile } from "@/lib/redux/slice/profileSlice";
import { IMessageResponse, IUser } from "@/lib/interface/auth";
import {
  LoaderIcon,
  UploadCloudIcon,
  AlertCircleIcon,
  CopyIcon,
} from "lucide-react";
import axios from "axios";
import { apiUrl } from "@/pages/config";

const defaultAvatarSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0aec0' stroke-width='1.5'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E";

interface PersonalInformationProps {
  user: IUser | null;
}

export default function PersonalInformation({
  user,
}: PersonalInformationProps) {
  const dispatch = useAppDispatch();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    user?.profilePicture || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
      setPreview(user.profilePicture || null);
    }
  }, [user]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePictureChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 1 * 1024 * 1024) {
        setError("Ukuran file tidak boleh lebih dari 1MB.");
        return;
      }
      setError(null);
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsEditMode(true);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    setIsLoading(true);

    let nameUpdateSuccess = false;
    let emailUpdateSuccess = false;
    let pictureUpdateSuccess = false;

    if (formData.fullName !== user?.fullName) {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
          `${apiUrl}/api/user/profile`,
          { fullName: formData.fullName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        nameUpdateSuccess = true;
      } catch (err: any) {
        setError(err.response?.data?.error || "Gagal memperbarui nama.");
        nameUpdateSuccess = false;
      }
    } else {
      nameUpdateSuccess = true;
    }

    if (formData.email !== user?.email) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.post<IMessageResponse>(
          `${apiUrl}/api/user/request-email-update`,
          { newEmail: formData.email },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccessMessage(response.data.message);
        emailUpdateSuccess = true;
      } catch (err: any) {
        setError(err.response?.data?.error || "Gagal meminta pembaruan email.");
        emailUpdateSuccess = false;
      }
    } else {
      emailUpdateSuccess = true;
    }

    if (profileImage) {
      const imageData = new FormData();
      imageData.append("file", profileImage);
      try {
        const token = localStorage.getItem("token");
        await axios.patch(`${apiUrl}/api/user/profile/picture`, imageData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        pictureUpdateSuccess = true;
      } catch (err: any) {
        setError(err.response?.data?.error || "Gagal memperbarui foto profil.");
        pictureUpdateSuccess = false;
      }
    } else {
      pictureUpdateSuccess = true;
    }

    if (nameUpdateSuccess && emailUpdateSuccess && pictureUpdateSuccess) {
      if (formData.email === user?.email && !successMessage) {
        setSuccessMessage("Perubahan berhasil disimpan.");
      }
      await dispatch(fetchProfile());
      setIsEditMode(false);
      setProfileImage(null);
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
    });
    setPreview(user?.profilePicture || null);
    setProfileImage(null);
    setError(null);
    setSuccessMessage("");
    setIsEditMode(false);
  };

  const handleCopyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopySuccess("Kode berhasil disalin!");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  return (
    <form onSubmit={handleSaveChanges} className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Foto Profil
        </h3>
        <div className="flex items-center gap-6">
          <img
            src={preview || defaultAvatarSvg}
            alt="Profile Preview"
            className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex-1">
            <label
              htmlFor="profile-picture-upload"
              className="cursor-pointer bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center"
            >
              <UploadCloudIcon className="h-5 w-5 mr-2" />
              <span>Ganti Foto</span>
            </label>
            <input
              id="profile-picture-upload"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
              onChange={handlePictureChange}
            />
            <p className="text-xs text-gray-500 mt-2">
              JPG, GIF, atau PNG. Ukuran maks 1MB.
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 border-t pt-8">
          Informasi Personal
        </h3>
        {error && (
          <div className="bg-red-50 p-3 rounded-md text-red-700 text-sm flex items-center">
            <AlertCircleIcon className="h-5 w-5 mr-2" /> {error}
          </div>
        )}
        {successMessage && !isEditMode && (
          <div className="bg-green-50 p-3 rounded-md text-green-700 text-sm">
            {successMessage}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleFormChange}
            readOnly={!isEditMode}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-black ${
              !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Alamat Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            readOnly={!isEditMode}
            className={`mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-black ${
              !isEditMode ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            required
          />
        </div>
      </div>
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Kode Referral Anda
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Bagikan kode ini ke teman Anda untuk mendapatkan hadiah!
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={user?.referralCode || "N/A"}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleCopyReferral}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex-shrink-0"
            title="Salin kode"
          >
            <CopyIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        {copySuccess && (
          <p className="text-sm text-green-600 mt-2">{copySuccess}</p>
        )}
      </div>
      <div className="flex justify-end gap-4 border-t pt-8">
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
              className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <LoaderIcon className="h-5 w-5 animate-spin" />
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditMode(true)}
            className="px-6 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
          >
            Edit Profil
          </button>
        )}
      </div>
    </form>
  );
}
